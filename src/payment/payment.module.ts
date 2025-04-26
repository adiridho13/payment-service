import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [ConfigModule],
})
export class PaymentModule {}
