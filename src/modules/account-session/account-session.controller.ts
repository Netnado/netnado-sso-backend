import { BadRequestException, Body, Controller, Headers, Ip, Post } from '@nestjs/common';
import { AccountSessionService } from '@/modules/account-session/account-session.service';
import { CreateNewAccountSessionDto } from '@/modules/account-session/dto/create-new-account-session.dto';

@Controller('account-session')
export class AccountSessionController {
    constructor(private readonly accountSessionService: AccountSessionService) {}

    @Post('/')
    async createNewAccountSession(
        @Body() createNewAccountSessionDto: CreateNewAccountSessionDto,
        @Ip() IPAddress: string,
        @Headers('user-agent') userAgent: string,
    ): Promise<any> {
        const { accountId, refreshToken, refreshTokenExpire } = createNewAccountSessionDto;
        if (!accountId || !refreshToken || !refreshTokenExpire) {
            throw new BadRequestException('Validation failed');
        }
        try {
            const result = await this.accountSessionService.createNewAccountSession(
                createNewAccountSessionDto,
                IPAddress,
                userAgent,
            );
            return {
                status: 201,
                message: 'Account session created successfully',
                data: result,
            };
        } catch (error: any) {
            throw new BadRequestException(error.message);
        }
    }
}
