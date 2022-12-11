import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class SubscriptionDto {
  readonly startDate: Date;
  readonly endDate: Date;
  readonly productId: string;
  readonly isCancelled: boolean;
  readonly type: string;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly subscription: SubscriptionDto;

  @ApiProperty()
  @IsBoolean()
  readonly hasSubscription: boolean;
}

export class GetPaymentResultDto {
  message: string;
}

export class GetActiveSubscriptionBody {
  id: number;

  latest_receipt: string;

  user_id: number;

  app: string;
}

export class GetPaymentBodyDto {
  @ApiProperty()
  readonly receipt?: string;

  @ApiProperty()
  readonly password?: string;

  @ApiProperty()
  readonly latestReceipt: string;

  @ApiProperty()
  readonly packageName?: string;

  @ApiProperty()
  readonly productId?: string;

  @ApiProperty()
  readonly purchaseToken?: string;

  @ApiProperty()
  readonly payment_method: string;
}
