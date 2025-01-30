import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { GENERAL_CONSTANTS } from '@/constants/general';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = GENERAL_CONSTANTS.SERVER_PORT;

  await app.listen(port);
  console.log(`🚀 Netnado SSO is running on http://localhost:${port}`);
}
bootstrap();
