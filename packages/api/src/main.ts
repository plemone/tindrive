import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * Function bootstraps the application and serves it
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(4000);
}

bootstrap();
