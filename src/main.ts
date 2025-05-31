import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import helmet from 'helmet';
import {ValidationPipe} from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser'


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser())
    app.use(helmet(),
        bodyParser.json({
            verify: (req: any, _res, buf) => {
                req.rawBody = buf;
            }})
        );
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    const isDev = process.env.NODE_ENV === "development";
    const allowedOrigin = isDev
        ? "http://localhost:3001"
        : "https://payment-ui-one.vercel.app";
    app.enableCors({
        origin: allowedOrigin,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true, // jika butuh kirim cookie atau Authorization header
    });
    await app.listen(process.env.PORT || 3000);
}
    bootstrap();
