import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AccountModule } from '@/modules/account/account.module';
import { AccountSessionModule } from '@/modules/account-session/account-session.module';
import { AccountSessionService } from '@/modules/account-session/account-session.service';

@Module({
    imports: [AccountModule, AccountSessionModule],
    providers: [AuthService, AccountSessionService],
    exports: [AuthService],
})
export class AuthModule {}
