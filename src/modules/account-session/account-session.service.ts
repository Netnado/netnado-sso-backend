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

    async logoutAccountSessions(accountId: string): Promise<any> {
        const accountSessions = await this.prismaService.accountSession.findMany({
            where: {
                account_id: accountId,
            },
        });

        for (const accountSession of accountSessions) {
            await this.prismaService.accountSession.update({
                where: {
                    id: accountSession.id,
                },
                data: {
                    logged_out_at: new Date(),
                },
            });
        }

        return {
            status: 200,
            message: 'Logout successfully',
        };
    }
}
