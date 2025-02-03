import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GENERAL_CONSTANTS } from '@/constants/general';
import { DATABASE_CONSTANTS } from '@/constants/database';
import { TokenService } from '@/shared/utils/token.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthController } from '@/modules/auth/auth.controller';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true })],
    controllers: [AuthController],
    providers: [
        // Add the constants to the providers array
        { provide: 'GENERAL_CONSTANTS', useValue: GENERAL_CONSTANTS },
        { provide: 'DATABASE_CONSTANTS', useValue: DATABASE_CONSTANTS },

        // Add the services to the providers array
        TokenService,
        PrismaService,
    ],
    exports: [TokenService, PrismaService],
})
export class AppModule {}
