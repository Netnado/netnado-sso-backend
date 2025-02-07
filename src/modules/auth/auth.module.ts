import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AccountModule } from '@/modules/account/account.module';

@Module({
    imports: [AccountModule],
    providers: [AuthService],
    exports: [AuthService],
})
export class AuthModule {}
