import { AuthService } from '@/modules/auth/auth.service';
import { StringUtil } from '@/shared/utils/string.util';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '@/modules/account/account.service';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';
import { AuthSignupDto } from './dto/auth-signup.dto';

describe('AuthService', () => {
    let authService: AuthService;
    let accountService: AccountService;

    const mockAccountService = {
        createNewAccount: jest
            .fn()
            .mockImplementation(
                async ({ email, username, password }: { email: string; username: string; password: string }) => {
                    if (email === 'admin@netnado.com') {
                        throw new Error('Email is already in use');
                    }
                    const mockResponse = {
                        id: 1,
                        email,
                        username,
                        password: await BcryptHelper.hash(password),
                    };
                    return mockResponse;
                },
            ),
        findAccountByEmail: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: AccountService, useValue: mockAccountService }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        accountService = module.get<AccountService>(AccountService);
    });

    describe('signup', () => {
        const validCreateUserDto = {
            email: 'test@jest.com',
            password: '123Jest!@#',
            username: 'jest',
        } as AuthSignupDto;

        it('should create new user successfully with valid tokens', async () => {
            const result = await authService.signup(validCreateUserDto);

            expect(accountService.createNewAccount).toHaveBeenCalledWith(validCreateUserDto);
            expect(result).toBeDefined();
            expect(result?.user).toBeDefined();
            expect(result?.user).toMatchObject({
                email: validCreateUserDto.email,
                username: validCreateUserDto.username,
                id: 1,
            });
        });

        // EMAIL
        it('should throw an error if the email is already in use', async () => {
            const payload = {
                ...validCreateUserDto,
                email: 'admin@netnado.com',
            };
            try {
                await authService.signup(payload);
            } catch (error: any) {
                expect(accountService.createNewAccount).toHaveBeenCalledWith(payload);
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Email is already in use');
            }
        });

        // PASSWORD
        it('should hash the password before storing', async () => {
            const result = await authService.signup(validCreateUserDto);

            expect(accountService.createNewAccount).toHaveBeenCalledWith(validCreateUserDto);
            expect(result).toBeDefined();
            expect(result?.user).toBeDefined();
            expect(result?.user?.password).not.toBe(validCreateUserDto.password);
            expect(result?.user?.password).toMatch(StringUtil.BCRYPT_PASSWORD_REGEX);
        });
    });

    describe('login', () => {
        const validLoginUserDto = {
            email: '',
            password: '',
        };

        it('should login successfully with valid tokens', async () => {
            const result = await authService.login({ validLoginUserDto });

            expect(result).toBeDefined();
            expect(result.accessToken).toBeDefined();
        });
    });
});
