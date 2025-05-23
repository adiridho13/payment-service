import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../entities/payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import {ConfigModule} from "@nestjs/config";
import {CallbackController} from 'src/webhook/callback.controller'
import {PaymentRequest} from "../entities/paymentRequest.entity";
@Module({
  controllers: [PaymentController,CallbackController],
  providers: [PaymentService],
  imports: [ConfigModule,TypeOrmModule.forFeature([Payment,PaymentRequest]),
    // AuthModule
  ],
})
export class PaymentModule {}
