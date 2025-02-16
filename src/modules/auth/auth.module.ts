import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AccountModule } from '@/modules/account/account.module';
import { AccountSessionModule } from '@/modules/account-session/account-session.module';
import { AccountSessionService } from '@/modules/account-session/account-session.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
    imports: [AccountModule, AccountSessionModule],
    providers: [AuthService, AccountSessionService, PrismaService],
    exports: [AuthService],
})
export class AuthModule {}
