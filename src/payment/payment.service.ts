import {
  BadGatewayException,
  BadRequestException,
  Injectable, InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {PaymentRequest} from "../entities/paymentRequest.entity";

@Injectable()
export class PaymentService {
  private readonly va: string;
  private readonly url: string;
  private readonly apiKey: string;

  constructor(
    @InjectRepository(Payment)
    private repo: Repository<Payment>,
    @InjectRepository(PaymentRequest)
    private repoPr: Repository<PaymentRequest>,
    private configService: ConfigService,
  ) {
    this.va = this.configService.get<string>('IPAYMU_VA')!;
    this.apiKey = this.configService.get<string>('IPAYMU_API_KEY')!;
    this.url = this.configService.get<string>('IPAYMU_URL')!;
    console.log('>> PAYMENT REPOSITORY INJECTED:', this.repo);
  }

  async createPayment(payload: CreatePaymentDto) {
    // 1. Hitung hash dan signature
    const bodyHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(payload))
      .digest('hex');

    const stringToSign = `POST:${this.va}:${bodyHash}:${this.apiKey}`;
    const signature = crypto
      .createHmac('sha256', this.apiKey)
      .update(stringToSign)
      .digest('hex');

    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      va: this.va,
      signature,
      timestamp: Date.now().toString(),
    };

    // const reqEntity: PaymentRequest = this.repoPr.create({
    //   user_id:      null,             // 🔑 required
    //   reference_id: payload.referenceId,        // 🔑 required
    //   request_body: JSON.stringify(payload),    // 🔑 required
    //   status_code:  0,
    // });
    // const savedReq = await this.repoPr.save(reqEntity);
    // 2. Panggil API IPAYMU
    // const response = await axios.post(this.url, payload, { headers });
    // const data = response.data.Data;
    let ipayResponseData: any;
    let ipayResponse: any;
    try {
      ipayResponse = await axios.post(this.url, payload, {
        headers
      });
      ipayResponseData = ipayResponse.data.Data;
      // 3. Simpan ke database
      console.log('refernceid value', ipayResponseData.ReferenceId);
      console.log('ipayresponsedata', ipayResponseData);
      const payment = this.repo.create({
        referenceId: ipayResponseData.ReferenceId,
        transactionId: ipayResponseData.TransactionId,
        channel: ipayResponseData.Channel,
        via: ipayResponseData.Via,
        amount: ipayResponseData.Total ?? payload.amount,
        status: ipayResponseData.Status ?? 'PENDING',

      });
      await this.repo.save(payment);
    } catch (err) {
      throw err;
    }

    // 4. Kembalikan response IPAYMU
    return ipayResponse.data;
  }

  async handleCallback(body: any) {
    const payment = await this.repo.findOneBy({
      referenceId: body.reference_id,
    });
    if (!payment) {
      throw new NotFoundException(`Payment ${body.reference_id} not found`);
    }

    // 2) Map your incoming status code to your enum/string
    const codeMap: Record<number, Payment['status']> = {
      1: 'SUCCESS',
      0: 'FAILED',
      3: 'FAILED',
    };
    const mapped = codeMap[body.transaction_status_code as number];
    if (!mapped) {
      throw new BadRequestException(`Unknown status: ${body.transaction_status_code}`);
    }

    // 3) Mutate and save
    payment.status = mapped;
    payment.paymentAt = new Date();
    // await this.repo.save(payment);
    //
    // await this.repoPr.update(body.reference_id, {
    //   response_body: JSON.stringify(body),
    //   http_status:   body.status_code,
    // });

    try {
      // 1. Simpan payment dulu
      const savedPayment = await this.repo.save(payment);

      // 2. Cek apakah save sukses (savedPayment bukan null/undefined)
      if (savedPayment && savedPayment.id) {
        // 3. Baru simpan response di repoPr
        const updateResult = await this.repoPr.update(
            { reference_id: body.reference_id },
            {
              response_body: JSON.stringify(body),
              status_code:   body.status_code,
            },
        );
        if (updateResult.affected && updateResult.affected > 0) {
          console.log(`Response untuk ${body.reference_id} berhasil disimpan.`);
        } else {
          console.warn(`Tidak ada baris yang di-update untuk reference_id=${body.reference_id}`);
        }
      } else {
        console.error('Gagal menyimpan payment:', savedPayment);
        throw new BadGatewayException('Terjadi kegagalan penyimpanan');
      }
    } catch (err) {
      console.error('Error saat proses save/update:', err);
      throw new InternalServerErrorException('Gagal menyimpan payment');
    }
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

  async checkReferenceId(referenceId: string): Promise<{ Data: Payment }> {
    const payment: Payment | any = await this.repo.findOneBy({
      referenceId: referenceId,
    });
    if (!payment) {
      throw new NotFoundException(`Payment ${referenceId} tidak ditemukan`);
    }
    return { Data: payment };
  }
}
