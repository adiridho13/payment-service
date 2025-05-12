import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {Payment} from "../entities/payment.entity";

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('pay')
  async pay(@Body() body: CreatePaymentDto) {
    return this.paymentService.createPayment(body);
  }

  // @Post('notify')
  // async webhook(@Body() body: any) {
  //   return this.paymentService.handleNotification(body);
  // }
  // @UseGuards(PaymentGuard)
  // @Post('ipaymu-callback')
  // @HttpCode(200)
  // handleCallback(@Body() body: any) {
  //   return this.paymentService.handleCallback(body);
  // }

  @UseGuards(JwtAuthGuard)
  @Get('statusTrx')
  async paymentStatus(@Query('transactionId') transactionId: string) {
    if (!transactionId) {
      return { error: 'Missing transactionId' };
    }

    try {
      const result =
        await this.paymentService.checkTransactionById(transactionId);

      const isPaid = result?.Data?.Status === 'Success';

      return {
        transactionId: transactionId,
        paid: isPaid,
        status: result?.Data?.Status || 'UNKNOWN',
      };
    } catch (e) {
      return { error: 'Gagal cek status transaksi' };
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get('status')
  async paymentStatusByRef(@Query('referenceId') referenceId: string) {
    if (!referenceId) {
      return { error: 'Missing referenceId' };
    }

    try {
      const result:{Data:Payment} =
          await this.paymentService.checkReferenceId(referenceId);

      const isPaid = result?.Data?.status === 'SUCCESS';

      return {
        referenceId: referenceId,
        paid: isPaid,
        status: result?.Data?.status,
        paymentDate: result?.Data?.payment_at,
      };
    } catch (e) {
      return { error: 'Gagal cek status transaksi' };
    }
  }

  @Post('notify')
  async handleNotify(@Body() body: any) {
    console.log('🔔 Simulasi Notify Diterima:', body);

    if (body.status === 1 && body.statusCode === 200) {
      // ✅ Update transaksi di database
      // await this.transactionService.markAsPaid(body.referenceId);

      return { message: 'Success', updated: true };
    }

    return { message: 'Ignored', status: body.status };
  }

  // @Get('status')
  // async getStatus(@Query('referenceId') ref: string) {
  //   const result = await this.paymentService.checkTransactionById(ref);
  //
  //   const isPaid = result?.Data?.Status === 'Success';
  //
  //   return {
  //     referenceId: ref,
  //     paid: isPaid,
  //     status: result?.Data?.Status || 'UNKNOWN',
  //   };
  // }
}
