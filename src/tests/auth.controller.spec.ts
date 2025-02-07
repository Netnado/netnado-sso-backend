import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '@/modules/auth/auth.controller';
import { AuthService } from '@/modules/auth/auth.service';
import { validSignupPayload } from '@/tests/mocks/auth.mock';

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
                mockAuthService.signup.mockResolvedValue({ user: { ...validSignupPayload, id: 1 } });
                const result = await authController.signup(validSignupPayload);

                expect(authService.signup).toHaveBeenCalledWith(validSignupPayload);
                expect(result).toEqual({
                    statusCode: 201,
                    message: 'User created successfully',
                    data: { user: { ...validSignupPayload, id: 1 } },
                });
            });

            it('should throw an error if email is missing', async () => {
                const payload = { ...validSignupPayload, email: '' };
                try {
                    await authController.signup(payload);
                } catch (error) {
                    expect(error.message).toEqual('Email and username and password are required');
                }
            });

            it('should throw an error if username is missing', async () => {
                const payload = { ...validSignupPayload, username: '' };
                try {
                    await authController.signup(payload);
                } catch (error) {
                    expect(error.message).toEqual('Email and username and password are required');
                }
            });

            it('should throw an error if password is missing', async () => {
                const payload = { ...validSignupPayload, password: '' };
                try {
                    await authController.signup(payload);
                } catch (error) {
                    expect(error.message).toEqual('Email and username and password are required');
                }
            });

            it('should throw an error if an error occurred in user service ', async () => {
                mockAuthService.signup.mockRejectedValue(new Error('Something went wrong'));
                try {
                    await authController.signup(validSignupPayload);
                } catch (error) {
                    expect(error.message).toEqual('Something went wrong');
                }
            });
        });
    });
});
