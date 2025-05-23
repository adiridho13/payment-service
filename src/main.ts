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
    app.enableCors({
        origin: [
            'payment-ui-one.vercel.app'
        ],
    });
    await app.listen(process.env.PORT || 3000);
}
    bootstrap();
