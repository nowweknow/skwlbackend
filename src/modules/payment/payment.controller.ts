import { Controller, Post, UseGuards, Body, Get, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.quard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtPayload } from '../auth/jwt/jwt-auth.strategy';
import { GetUser } from '../../shared/decorators/get-user.decorator';
import { SubscriptionResponseDto, GetPaymentResultDto, GetPaymentBodyDto } from './paymentDto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiBearerAuth()
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getPayment(@GetUser() user: JwtPayload, @Body() body: GetPaymentBodyDto): Promise<GetPaymentResultDto> {
    return this.paymentService.getPayment(body, user.id);
  }

  @ApiBearerAuth()
  @Get('user-subscription/:appType')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getUserSubscription(@GetUser() user: JwtPayload, @Param('appType') appType: string): Promise<SubscriptionResponseDto> {
    return this.paymentService.getSubscription(user.id, appType);
  }
}
