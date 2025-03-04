import { BadRequestException, Body, Headers, Controller, Ip, Post, UsePipes, ValidationPipe, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthSignupDto } from '@/modules/auth/dto/auth-signup.dto';
import { AuthLoginDto } from '@/modules/auth/dto/auth-login.dto';
import { StringUtil } from '@/shared/utils/string.util';
import { SessionAuthGuard } from '@/modules/auth/auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe({ transform: true }))
    async signup(@Body() authSignupDto: AuthSignupDto) {
        try {
            const { email, username, password } = authSignupDto;
            if (!email || !username || !password) {
                throw new BadRequestException('Validation failed');
            }

            const result = await this.authService.signup(authSignupDto);
            if (!result) {
                throw new BadRequestException('Something went wrong');
            }
            return {
                status: 201,
                message: 'Signup successfully',
                data: StringUtil.keysToCamelCase(result),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ transform: true }))
    async login(@Body() authLoginDto: AuthLoginDto, @Ip() IPAddress: string, @Headers('user-agent') userAgent: string) {
        try {
            const { keyword, password } = authLoginDto;
            if (!keyword || !password) {
                throw new BadRequestException('Validation failed');
            }

            const result = await this.authService.login(authLoginDto, IPAddress, userAgent);
            if (!result) {
                throw new BadRequestException('Something went wrong');
            }
            return {
                status: 200,
                message: 'Login successfully',
                data: StringUtil.keysToCamelCase(result),
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @UseGuards(SessionAuthGuard)
    @Post('logout')
    async logout(@Req() req: any) {
        try {
            if (!req.account) {
                throw new BadRequestException('Account not found');
            }

            const result = await this.authService.logout(req.account.id);
            if (!result) {
                throw new BadRequestException('Something went wrong');
            }
            return {
                status: 200,
                message: 'Logout successfully',
                data: result,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
