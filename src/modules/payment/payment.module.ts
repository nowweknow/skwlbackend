import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Subscription])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule { }
