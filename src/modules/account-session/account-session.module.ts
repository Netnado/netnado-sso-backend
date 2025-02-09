import { Module } from '@nestjs/common';
import { AccountSessionService } from '@/modules/account-session/account-session.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
    imports: [],
    providers: [AccountSessionService, PrismaService],
    exports: [AccountSessionService],
})
export class AccountSessionModule {}
