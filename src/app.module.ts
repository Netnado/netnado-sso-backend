import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GENERAL_CONSTANTS } from '@/constants/general';
import { DATABASE_CONSTANTS } from '@/constants/database';
import { TokenService } from '@/shared/utils/token.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [
    // Add the constants to the providers array
    { provide: 'GENERAL_CONSTANTS', useValue: GENERAL_CONSTANTS },
    { provide: 'DATABASE_CONSTANTS', useValue: DATABASE_CONSTANTS },

    // Add the services to the providers array
    TokenService,
  ],
  exports: [TokenService],
})
export class AppModule {}
