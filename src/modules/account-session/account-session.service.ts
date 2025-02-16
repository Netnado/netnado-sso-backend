import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateNewAccountSessionDto } from '@/modules/account-session/dto/create-new-account-session.dto';
import { LodashHelper } from '@/shared/helpers/lodash.helper';

@Injectable()
export class AccountSessionService {
    constructor(private readonly prismaService: PrismaService) {}

    async createNewAccountSession(
        createNewAccountSessionDto: CreateNewAccountSessionDto,
        IPAddress: string,
        userAgent: string,
    ): Promise<any> {
        const { accountId, refreshToken, refreshTokenExpire } = createNewAccountSessionDto;
        const newAccountSession = await this.prismaService.accountSession.create({
            data: {
                account_id: accountId,
                refresh_token: refreshToken,
                refresh_token_expire: refreshTokenExpire,
                ip_address: IPAddress,
                device: userAgent,
            },
        });

        return LodashHelper.omit(newAccountSession, ['refresh_token', 'used_refresh_tokens']);
    }
}
