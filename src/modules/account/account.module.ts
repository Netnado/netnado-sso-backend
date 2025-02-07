import { Module } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { PrismaService } from '@/prisma/prisma.service';

@Module({
    imports: [],
    providers: [AccountService, PrismaService],
    exports: [AccountService],
})
export class AccountModule {}
