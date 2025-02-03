import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthSignupDto } from '@/modules/auth/dto/auth-signup.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe({ transform: true }))
    async signup(@Body() authSignupDto: AuthSignupDto) {
        try {
            const { email, username, password } = authSignupDto;
            if (!email || !username || !password) {
                throw new BadRequestException('Email and username and password are required');
            }

            const result = await this.authService.signup(authSignupDto);
            if (!result) {
                throw new BadRequestException('Something went wrong');
            }
            return {
                statusCode: 201,
                message: 'User created successfully',
                data: result,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
