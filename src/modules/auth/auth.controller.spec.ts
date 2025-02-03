import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSignupDto } from './dto/auth-signup.dto';

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    const mockAuthService = {
        signup: jest.fn().mockImplementation(async (authSignupDto: AuthSignupDto) => {
            return { user: { ...authSignupDto, id: 1 } };
        }),
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
        jest.resetAllMocks();
    });

    describe('AuthController', () => {
        describe('signup', () => {
            const validSignupPayload = {
                email: 'test@netnado.tester.com',
                password: '123Jest!@#',
                username: 'netnado tester',
            };

            it('should signup new user successfully', async () => {
                const result = await authController.signup(validSignupPayload);

                expect(authService.signup).toHaveBeenCalledWith(validSignupPayload);
                expect(result).toEqual({
                    statusCode: 201,
                    message: 'User created successfully',
                    data: { user: { ...validSignupPayload, id: 1 } },
                });
            });
        });
    });
});
