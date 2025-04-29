import {ConfigModule, ConfigService} from "@nestjs/config";
import { TypeOrmModule } from '@nestjs/typeorm';      // ⬅ import ini
import {PaymentModule} from "./payment/payment.module";
import {Module} from "@nestjs/common";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true,
        envFilePath: ['.env'],
      })],
      useFactory: (cfg: ConfigService) => ({
        type: 'postgres',
        url: cfg.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        // synchronize: cfg.get<string>('NODE_ENV') !== 'production',
        synchronize: true,
        logging: true,
        logger: 'advanced-console',
      }),
      inject: [ConfigService],
    }),
    PaymentModule,
  ],
})
export class AppModule {}