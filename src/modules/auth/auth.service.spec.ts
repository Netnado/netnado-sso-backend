import { AuthService } from '@/modules/auth/auth.service';
import { StringUtil } from '@/shared/utils/string.util';
import { TokenService } from '@/shared/utils/token.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
    let authService: AuthService;
    // Dependency Injection
    let tokenService: TokenService;

    const mockTokenService = {
        generateToken: jest.fn().mockImplementation((payload: any) => {
            return 'mock_token_' + payload.userId;
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: TokenService, useValue: mockTokenService }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    describe('signup', () => {
        const validCreateUserDto = {
            email: 'test@jest.com',
            password: '123Jest!@#',
            username: 'jest',
        };

        it('should create new user successfully with valid tokens', async () => {
            const result = await authService.signup({ validCreateUserDto });

            expect(result).toBeDefined();
            expect(result?.user).toBeDefined();
            expect(result?.user?.id).toBeDefined();
            expect(result?.user?.public_id).toBeDefined();
            expect(result?.user?.email).toBe(validCreateUserDto.email);
            expect(result?.user?.username).toBe(validCreateUserDto.username);
            expect(result?.accessToken).toBeDefined();
        });

        // EMAIL
        it('should throw an error if the email is missing', async () => {
            try {
                await authService.signup({
                    ...validCreateUserDto,
                    email: '',
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Email is required');
            }
        });

        it('should throw an error if the email is invalid', async () => {
            try {
                await authService.signup({
                    ...validCreateUserDto,
                    email: 'test',
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Email is invalid');
            }
        });

        it('should throw an error if the email is already in use', async () => {
            try {
                await authService.signup({
                    ...validCreateUserDto,
                    email: 'admin@netnado.com',
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Email is already in use');
            }
        });

        // PASSWORD
        it('should throw an error if the password is missing', async () => {
            try {
                await authService.signup({
                    ...validCreateUserDto,
                    password: '',
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Password is required');
            }
        });

        it('should throw an error if the password is not strong enough', async () => {
            try {
                await authService.signup({
                    ...validCreateUserDto,
                    password: 'password',
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Password is not strong enough');
            }
        });

        it('should hash the password before storing', async () => {
            const result = await authService.signup({ validCreateUserDto });

            expect(result).toBeDefined();
            expect(result?.user).toBeDefined();
            expect(result?.user?.id).toBeDefined();
            expect(result?.user?.password).not.toBe(validCreateUserDto.password);
            expect(result?.user?.password).toMatch(StringUtil.BCRYPT_PASSWORD_REGEX);
        });

        // USERNAME
        it('should throw an error if the username is missing', async () => {
            try {
                await authService.signup({
                    ...validCreateUserDto,
                    username: '',
                });
            } catch (error: any) {
                expect(error).toBeDefined();
                expect(error.message).toBeDefined();
                expect(error.message).toBe('Username is required');
            }
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
            expect(tokenService.generateToken).toHaveBeenCalledWith({
                userId: result.user.id,
            });
            expect(result.accessToken).toBe('mock_token_' + result.user.id);
        });
    });
});
