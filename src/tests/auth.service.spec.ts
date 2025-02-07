import { AuthService } from '@/modules/auth/auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from '@/modules/account/account.service';

import { mockAccountService, validSignupPayload, validSignupResult } from '@/tests/mocks/auth.mock';

describe('AuthService', () => {
    let authService: AuthService;
    let accountService: AccountService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AuthService, { provide: AccountService, useValue: mockAccountService }],
        }).compile();

        authService = module.get<AuthService>(AuthService);
        accountService = module.get<AccountService>(AccountService);
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
            expect(result).toBeDefined();
            expect(result?.user).toEqual(validSignupResult);
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
});
