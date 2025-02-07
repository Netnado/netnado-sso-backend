import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { GENERAL_CONSTANTS } from '@/constants/general';
import { ValidationExceptionFilter } from '@/filters/exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type, Authorization',
    });
    const port = GENERAL_CONSTANTS.SERVER_PORT;

    app.useGlobalFilters(new ValidationExceptionFilter());
    await app.listen(port);
    console.log(`🚀 Netnado SSO is running on http://localhost:${port}`);
}
bootstrap();
