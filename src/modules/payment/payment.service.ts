import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { google } from 'googleapis';
import { Repository } from 'typeorm';
import { JWT } from 'google-auth-library';
import * as iap from 'in-app-purchase';
import { Subscription } from '../entities/subscription.entity';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { GOOGLEAPIS } from '../../config/constants';
import { SubscriptionResponseDto, GetPaymentResultDto, GetPaymentBodyDto } from './paymentDto';

@Injectable()
export class PaymentService implements OnModuleInit {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}
  onModuleInit() {
    setInterval(() => this.validateAllSubscriptions(), 24 * 60 * 60 * 1000);
  }

  private androidGoogleApi: any = {};

  async getSubscription(userId: number, appType: string): Promise<SubscriptionResponseDto> {
    if (!appType) return undefined;

    const row = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.user_id = :userId', { userId })
      .andWhere('subscription.app = :appType', { appType })
      .select(['start_date', 'end_date', 'product_id', 'is_cancelled'])
      .orderBy('start_date', 'DESC')
      .getOne();

    if (!row) return undefined;

    const subscription = {
      startDate: row.start_date,
      endDate: row.end_date,
      productId: row.product_id,
      isCancelled: !!row.is_cancelled,
      type: 'iap',
    };

    return {
      subscription,
      hasSubscription: this.checkIfHasSubscription(subscription),
    };
  }

  checkIfHasSubscription(subscription): boolean {
    if (!subscription) return false;
    if (subscription.isCancelled) return false;
    const nowMs = new Date().getTime();
    return moment(subscription.startDate).valueOf() <= nowMs && moment(subscription.endDate).valueOf() >= nowMs; // TODO grace period?
  }

  async getPayment(body: GetPaymentBodyDto, userId: number): Promise<GetPaymentResultDto> {
    // you need packageName, productId, purchaseToken from client side
    // and access_token from server side should be from json file downloaded from google play store
    google.options({ auth: new JWT(process.env.GOOGLE_CLIENT_ID, null, process.env.GOOGLE_SECRET, [GOOGLEAPIS]) });
    this.androidGoogleApi = google.androidpublisher({ version: 'v3' });
    const androidPackageName = process.env.ANDROID_PACKAGE_NAME;
    const iapTestMode = process.env.IAP_TEST_MODE === 'true';

    let receipt = {};
    if (body.payment_method === 'android') {
      receipt = {
        packageName: androidPackageName,
        productId: body.productId,
        purchaseToken: body.purchaseToken,
        subscription: true,
      };
    } else if (body.payment_method === 'ios') {
      receipt = body['receipt-data'];
    }
    iap.config({
      appleExcludeOldTransactions: true,
      applePassword: process.env.APPLE_PASSWORD,
      googleServiceAccount: {
        clientEmail: process.env.GOOGLE_CLIENT_EMAIL,
        privateKey: process.env.GOOGLE_PRIVAT_KEY,
      },
      test: iapTestMode,
    });

    await this.processPurchase(body.payment_method, userId, receipt);

    return { message: 'subscription validated' };
  }

  async validateAllSubscriptions(): Promise<void> {
    const subscriptions = await this.getActiveSubscriptions();
    for (const subscription of subscriptions) {
      try {
        if (subscription.app === 'ios') {
          await this.processPurchase(subscription.app, subscription.userId, subscription.latest_receipt);
        } else {
          await this.processPurchase(subscription.app, subscription.userId, JSON.parse(subscription.latest_receipt));
        }
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    }
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    const currentDate = new Date();
    return await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.end_date >= :date', { currentDate })
      .where('subscription.fake = false')
      .select(['id', 'latest_receipt', 'userId', 'app'])
      .getMany();
  }

  async processPurchase(app, userId, receipt): Promise<void> {
    await iap.setup();
    const validationResponse = await iap.validate(receipt);

    const purchaseData = iap.getPurchaseData(validationResponse);
    const firstPurchaseItem = purchaseData[0];

    const isCancelled = iap.isCanceled(firstPurchaseItem);
    // const isExpired = iap.isExpired(firstPurchaseItem);
    const { productId } = firstPurchaseItem;
    const origTxId = app === 'ios' ? firstPurchaseItem.originalTransactionId : firstPurchaseItem.transactionId;
    const latestReceipt = app === 'ios' ? validationResponse.latest_receipt : JSON.stringify(receipt);
    const startDate = app === 'ios' ? new Date(firstPurchaseItem.originalPurchaseDateMs) : new Date(parseInt(firstPurchaseItem.startTimeMillis, 10));
    const endDate = app === 'ios' ? new Date(firstPurchaseItem.expiresDateMs) : new Date(parseInt(firstPurchaseItem.expiryTimeMillis, 10));

    let environment = '';
    if (app === 'ios') {
      environment = validationResponse.sandbox ? 'sandbox' : 'production';
    }

    await this.updateSubscription(userId, app, environment, productId, origTxId, latestReceipt, validationResponse, startDate, endDate, isCancelled);

    if (app === 'android' && validationResponse.acknowledgementState === 0) {
      await this.androidGoogleApi.purchases.subscriptions.acknowledge({
        packageName: process.env.ANDROID_PACKAGE_NAME,
        subscriptionId: productId,
        token: receipt.purchaseToken,
      });
    }
  }

  async updateSubscription(userId, app, environment, productId, origTxId, latestReceipt, validationResponse, startDate, endDate, isCancelled): Promise<Subscription> {
    const data = {
      app,
      environment,
      userId: userId,
      orig_tx_id: origTxId,
      validation_response: JSON.stringify(validationResponse),
      latest_receipt: latestReceipt,
      start_date: startDate,
      end_date: endDate,
      product_id: productId,
      is_cancelled: isCancelled,
    };

    try {
      const payment = this.subscriptionRepository.create(data);
      return await this.subscriptionRepository.save(payment);
    } catch (err) {
      throw err;
    }
  }
}
