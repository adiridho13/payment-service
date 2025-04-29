import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class PaymentGuard implements CanActivate {
  private readonly secret: string;

  constructor(private readonly cfg: ConfigService) {
    const sec = this.cfg.get<string>('IPAYMU_WEBHOOK_SECRET');
    if (!sec) {
      throw new Error('Missing IPAYMU_WEBHOOK_SECRET in environment');
    }
    this.secret = sec;
  }

  canActivate(ctx: ExecutionContext): boolean {
    const sec = this.cfg.get<string>('IPAYMU_WEBHOOK_SECRET');
    const req = ctx.switchToHttp().getRequest<Request & { rawBody: Buffer }>();
    const signature = req.headers['x-signature'] as string | undefined;
    if (!signature) {
      throw new ForbiddenException('No signature header');
    }

    if (signature !== sec) {
      throw new ForbiddenException('Invalid signature');
    }

    return true;
  }
}
