import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';  // <-- penting

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // Middleware
    app.use(cookieParser());
    app.use(
        helmet(),
        bodyParser.json({
            verify: (req: any, _res, buf) => {
                req.rawBody = buf;
            },
        }),
    );

    // Validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    // Prefix global → /api
    app.setGlobalPrefix('api');

    // Penting kalau di belakang Nginx dan pakai cookie "secure"
    app.set('trust proxy', 1);

    // CORS
    const isDev = process.env.NODE_ENV === 'development';
    const allowedOrigin = isDev
        ? 'http://localhost:3001'
        : process.env.CORS_ORIGIN || 'https://sandbox-payment.facport.com';

    app.enableCors({
        origin: allowedOrigin,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
    });

    await app.listen(process.env.PORT || 3301, '0.0.0.0');
}
bootstrap();
