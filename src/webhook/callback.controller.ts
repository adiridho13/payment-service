import {Controller, Post, Body, Headers, UnauthorizedException, UseGuards} from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';
import {PaymentGuard} from "../payment/payment.guard";

@Controller('ipaymu')
export class CallbackController {
    constructor(private readonly paymentService: PaymentService) {}

    /**
     * Endpoint yang dipanggil iPaymu setelah user menyelesaikan pembayaran.
     * Verifikasi signature, lalu update status di database.
     */
    // @UseGuards(PaymentGuard)
    @Post('callback')
    async handleCallback(
        @Body() body: any
    ) {
        // Delegasi ke service untuk verifikasi dan update
        return this.paymentService.handleCallback(body);
    }
}
