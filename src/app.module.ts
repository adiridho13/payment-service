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

        // type: 'postgres',
        // url: cfg.get<string>('DATABASE_URL'),
        type: "mariadb",                        // Ubah menjadi 'mariadb'
        host: cfg.get<string>("DB_HOST"),       // alamat host MariaDB
        port: cfg.get<number>("DB_PORT"),
        username: cfg.get<string>("DB_USER"),   // user MariaDB
        password: cfg.get<string>("DB_PASS"),   // password MariaDB
        database: cfg.get<string>("DB_NAME"),
        autoLoadEntities: true,
        // synchronize: cfg.get<string>('NODE_ENV') !== 'production',
        synchronize: cfg.get<string>('NODE_ENV') !== 'production',
        logging: true,
        logger: 'advanced-console',
        charset: 'utf8mb4',
      }),
      inject: [ConfigService],
    }),
    PaymentModule,
  ],
})
export class AppModule {}