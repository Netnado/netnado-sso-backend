import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GENERAL_CONSTANTS } from '@/constants/general';
import { DATABASE_CONSTANTS } from '@/constants/database';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthModule } from '@/modules/auth/auth.module';
import { AppService } from '@/app.service';
import { AppController } from '@/app.controller';
import { AccountController } from '@/modules/account/account.controller';
import { AccountModule } from '@/modules/account/account.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, AccountModule],
    controllers: [AppController, AuthController, AccountController],
    providers: [
        AppService,
        // Add the constants to the providers array
        { provide: 'GENERAL_CONSTANTS', useValue: GENERAL_CONSTANTS },
        { provide: 'DATABASE_CONSTANTS', useValue: DATABASE_CONSTANTS },

        // Add the services to the providers array
        PrismaService,
    ],
    exports: [PrismaService],
})
export class AppModule {}
