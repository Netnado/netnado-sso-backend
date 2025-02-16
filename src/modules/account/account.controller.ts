import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccountService } from '@/modules/account/account.service';
import { CreateNewAccountDto } from '@/modules/account/dto/create-new-account.dto';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService) {}

    @Post('/')
    @UsePipes(new ValidationPipe({ transform: true }))
    async createNewAccount(@Body() createNewAccountDto: CreateNewAccountDto) {
        try {
            const { email, username, password } = createNewAccountDto;
            if (!email || !username || !password) {
                throw new BadRequestException('Validation failed');
            }

            const result = await this.accountService.createNewAccount(createNewAccountDto);
            if (!result) {
                throw new BadRequestException('Something went wrong');
            }
            return {
                status: 201,
                message: 'Account created successfully',
                data: result,
            };
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
