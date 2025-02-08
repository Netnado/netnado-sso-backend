import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { validLoginPayload, validLoginResult, validSignupPayload } from '@/tests/mocks/auth.mock';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signup: jest.fn(),
        login: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockAuthService }],
        }).compile();

        authController = module.get<AuthController>(AuthController);
        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('AuthController', () => {
        describe('signup', () => {
            it('should signup new user successfully', async () => {
                mockAuthService.signup.mockResolvedValue({ account: { ...validSignupPayload, id: 1 } });
                const result = await authController.signup(validSignupPayload);

                expect(authService.signup).toHaveBeenCalledWith(validSignupPayload);
                expect(result).toEqual({
                    statusCode: 201,
                    message: 'Signup successfully',
                    data: { account: { ...validSignupPayload, id: 1 } },
                });
            });

            it('should throw an error if validation pipe failed', async () => {
                const payload = { ...validSignupPayload, email: '' };
                try {
                    await authController.signup(payload);
                } catch (error) {
                    expect(error.message).toEqual('Validation failed');
                }
            });

            it('should throw an error if an error occurred in auth service ', async () => {
                mockAuthService.signup.mockRejectedValue(new Error('Something went wrong'));
                try {
                    await authController.signup(validSignupPayload);
                } catch (error) {
                    expect(error.message).toEqual('Something went wrong');
                }
            });
        });

        describe('login', () => {
            it('should login successfully', async () => {
                mockAuthService.login.mockResolvedValue(validLoginResult);
                const result = await authController.login(validLoginPayload);

                expect(authService.login).toHaveBeenCalledWith(validLoginPayload);
                expect(result).toEqual({
                    statusCode: 200,
                    message: 'Login successfully',
                    data: validLoginResult,
                });
            });

            it('should throw an error if validation pipe failed', async () => {
                const payload = { ...validLoginPayload, keyword: '' };
                try {
                    await authController.login(payload);
                } catch (error) {
                    expect(error.message).toEqual('Validation failed');
                }
            });

            it('should throw an error if an error occurred in auth service', async () => {
                mockAuthService.login.mockRejectedValue(new Error('Something went wrong'));
                try {
                    await authController.login(validLoginPayload);
                } catch (error) {
                    expect(error.message).toEqual('Something went wrong');
                }
            });
        });
    });
});
