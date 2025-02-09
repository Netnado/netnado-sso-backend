import { AuthService } from '@/modules/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '@/modules/account/account.service';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';
import { JwtHelper } from '@/shared/helpers/jwt.helper';
import {
    mockAccountService,
    mockAccountSessionService,
    validLoginPayload,
    validLoginResult,
    validLoginSessionResult,
    validSignupPayload,
    validSignupResult,
} from '@/tests/mocks/auth.mock';
import { AccountSessionService } from '@/modules/account-session/account-session.service';

describe('AuthService', () => {
    let authService: AuthService;
    let accountService: AccountService;
    let accountSessionService: AccountSessionService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: AccountService, useValue: mockAccountService },
                { provide: AccountSessionService, useValue: mockAccountSessionService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        accountService = module.get<AccountService>(AccountService);
        accountSessionService = module.get<AccountSessionService>(AccountSessionService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('signup', () => {
        it('should signup successfully', async () => {
            mockAccountService.findAccountByEmail.mockResolvedValue(null);
            mockAccountService.createNewAccount.mockResolvedValue(validSignupResult);

            const result = await authService.signup(validSignupPayload);

            expect(accountService.findAccountByEmail).toHaveBeenCalledWith(validSignupPayload.email);
            expect(accountService.createNewAccount).toHaveBeenCalledWith(validSignupPayload);
            expect(result).toEqual({ account: validSignupResult });
        });

        it('should throw an error if the email is already in use', async () => {
            try {
                mockAccountService.findAccountByEmail.mockResolvedValue(validSignupResult);

                await authService.signup(validSignupPayload);
            } catch (error: any) {
                expect(accountService.findAccountByEmail).toHaveBeenCalledWith(validSignupPayload.email);
                expect(error.message).toBe('Email is already in use');
            }
        });

        it('should throw an error if another error occurred in account service', async () => {
            try {
                mockAccountService.findAccountByEmail.mockRejectedValue(new Error('Unexpected error'));
                await authService.signup(validSignupPayload);
            } catch (error: any) {
                expect(accountService.findAccountByEmail).toHaveBeenCalledWith(validSignupPayload.email);
                expect(error.message).toBe('Unexpected error');
            }
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            mockAccountService.findAccountByLogin.mockResolvedValue(validLoginResult.account);
            jest.spyOn(BcryptHelper, 'compare').mockResolvedValue(true);
            jest.spyOn(JwtHelper, 'generateAccessToken').mockReturnValue('access-token');
            jest.spyOn(JwtHelper, 'generateRefreshToken').mockReturnValue('refresh-token');
            mockAccountSessionService.createNewAccountSession.mockResolvedValue(validLoginSessionResult);

            const result = await authService.login(
                validLoginPayload.authLoginDto,
                validLoginPayload.userAgent,
                validLoginPayload.ipAddress,
            );

            expect(accountService.findAccountByLogin).toHaveBeenCalledWith(validLoginPayload.authLoginDto.keyword);
            expect(BcryptHelper.compare).toHaveBeenCalled();
            expect(JwtHelper.generateAccessToken).toHaveBeenCalled();
            expect(JwtHelper.generateRefreshToken).toHaveBeenCalled();
            expect(accountSessionService.createNewAccountSession).toHaveBeenCalled();
            expect(result).toEqual(validLoginResult);
        });

        it('should throw an error if the account is not found', async () => {
            try {
                mockAccountService.findAccountByLogin.mockResolvedValue(null);
                await authService.login(
                    validLoginPayload.authLoginDto,
                    validLoginPayload.userAgent,
                    validLoginPayload.ipAddress,
                );
            } catch (error: any) {
                expect(accountService.findAccountByLogin).toHaveBeenCalledWith(validLoginPayload.authLoginDto.keyword);
                expect(error.message).toBe('Incorrect keyword or password');
            }
        });

        it('should throw an error if the password is incorrect', async () => {
            try {
                mockAccountService.findAccountByLogin.mockResolvedValue(validLoginResult.account);
                jest.spyOn(BcryptHelper, 'compare').mockResolvedValue(false);

                await authService.login(
                    validLoginPayload.authLoginDto,
                    validLoginPayload.userAgent,
                    validLoginPayload.ipAddress,
                );
            } catch (error: any) {
                expect(accountService.findAccountByLogin).toHaveBeenCalledWith(validLoginPayload.authLoginDto.keyword);
                expect(BcryptHelper.compare).toHaveBeenCalled();
                expect(error.message).toBe('Incorrect keyword or password');
            }
        });

        it('should throw an error if another error occurred in another service', async () => {
            try {
                mockAccountService.findAccountByLogin.mockRejectedValue(new Error('Unexpected error'));
                await authService.login(
                    validLoginPayload.authLoginDto,
                    validLoginPayload.userAgent,
                    validLoginPayload.ipAddress,
                );
            } catch (error: any) {
                expect(accountService.findAccountByLogin).toHaveBeenCalledWith(validLoginPayload.authLoginDto.keyword);
                expect(error.message).toBe('Unexpected error');
            }
        });
    });
});
