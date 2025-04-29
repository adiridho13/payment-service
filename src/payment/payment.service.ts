import {BadRequestException, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import {Repository} from "typeorm";
import {Payment} from "../entities/payment.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class PaymentService {
  private readonly va: string;
  private readonly url: string;
  private readonly apiKey: string;

  constructor(
      @InjectRepository(Payment)
      private repo: Repository<Payment>,
      private configService: ConfigService) {
    this.va = this.configService.get<string>('IPAYMU_VA')!;
    this.apiKey = this.configService.get<string>('IPAYMU_API_KEY')!;
    this.url = this.configService.get<string>('IPAYMU_URL')!;
  }

  async createPayment(payload: CreatePaymentDto) {
    const bodyEncrypt = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');

    const stringToSign = `POST:${this.va}:${bodyEncrypt}:${this.apiKey}`;

    const signature = crypto
      .createHmac('sha256', this.apiKey)
      .update(stringToSign)
      .digest('hex');
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      va: this.va,
      signature: signature,
      timestamp: Date.now().toString(),
    };

    const response = await axios.post(this.url, payload, { headers });
    console.log('INI RESPONSE', response);
    return response.data;
  }

  async handleCallback(body: any) {
    const payment:Payment|null = await this.repo.findOneBy({
      referenceId: body.invoice,
    });
    if (!payment) {
      throw new NotFoundException(
          `Payment for invoice ${body.invoice} not found`,
      );
    }
    const codeMap: Record<number, Payment['status']> = {
      1: 'SUCCESS',
      0: 'FAILED',
      3: 'FAILED',
    };

    const incoming:any = body.transaction_status_code;
    const mapped   = codeMap[incoming];
    if (!mapped) {
      throw new BadRequestException(
          `Unknown payment status: ${incoming}`,
      );
    }
    payment.status = mapped;
    await this.repo.save(payment);

    return { status: 'ok' };
  }

  async checkTransactionById(transactionId: string) {
    const payload = { transactionId };
    const body = JSON.stringify(payload);

    const bodyHash = crypto.createHash('sha256').update(body).digest('hex');
    const stringToSign = `POST:${this.va}:${bodyHash}:${this.apiKey}`;
    const signature = crypto
      .createHmac('sha256', this.apiKey)
      .update(stringToSign)
      .digest('hex');

    const timestamp = new Date().toISOString();

    try {
      const response = await axios.post(
        'https://sandbox.ipaymu.com/api/v2/transaction',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            va: this.va,
            signature: signature,
            timestamp: timestamp,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error('Error checking transaction by ID:', error.message);
      throw new Error('Gagal mengambil status transaksi');
    }
  }
}
