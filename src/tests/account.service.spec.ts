import { AccountService } from '@/modules/account/account.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
    mockPrismaService,
    validCreateNewAccountParameters,
    validCreateNewAccountPayload,
    validCreateNewAccountResult,
    validFindAccountByKeywordPayload,
    validFindAccountByKeywordResult,
    validFindAccountByLoginPayload,
    validFindAccountByLoginResult,
} from '@/tests/mocks/account.mock';
import { Test } from '@nestjs/testing';
import { CryptoUtil } from '@/shared/utils/crypto.util';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';

describe('AccountService', () => {
    let accountService: AccountService;
    let prismaService: PrismaService;

    const mockLockExpiresAt = new Date(); // Mock lock_expires_at date that will be added in beforeEach()

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AccountService, { provide: PrismaService, useValue: mockPrismaService }],
        }).compile();

        prismaService = module.get<PrismaService>(PrismaService);
        accountService = module.get<AccountService>(AccountService);

        jest.spyOn(CryptoUtil, 'generatePublicId').mockReturnValue(validCreateNewAccountParameters.data.public_id);
        jest.spyOn(CryptoUtil, 'generateRSAKeysForAccess').mockReturnValue({
            privateKey: validCreateNewAccountParameters.data.private_key,
            publicKey: validCreateNewAccountParameters.data.public_key,
        });
        jest.spyOn(BcryptHelper, 'hash').mockReturnValue(validCreateNewAccountParameters.data.password as any);

        // Mock lock_expires_at date 24h from now
        mockLockExpiresAt.setDate(mockLockExpiresAt.getDate() + 1);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    describe('createNewAccount', () => {
        it('should create new user successfully', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(null);
            mockPrismaService.authProvider.findUnique.mockResolvedValue({ id: 1, name: 'Local' });
            mockPrismaService.accountStatus.findUnique.mockResolvedValue({ id: 1, name: 'Pending' });
            mockPrismaService.accountRole.findUnique.mockResolvedValue({ id: 1, name: 'User' });
            mockPrismaService.account.create.mockResolvedValue(validCreateNewAccountResult);

            const result = await accountService.createNewAccount(validCreateNewAccountPayload);

            expect(prismaService.account.findUnique).toHaveBeenCalledWith({
                where: { email: validCreateNewAccountPayload.email },
            });
            expect(prismaService.authProvider.findUnique).toHaveBeenCalledWith({ where: { name: 'Local' } });
            expect(prismaService.accountStatus.findUnique).toHaveBeenCalledWith({ where: { name: 'Pending' } });
            expect(prismaService.accountRole.findUnique).toHaveBeenCalledWith({ where: { name: 'User' } });
            expect(prismaService.account.create).toHaveBeenCalledWith(validCreateNewAccountParameters);
            expect(result).toEqual(validCreateNewAccountResult);
        });

        it('should throw an error if the email is already in use', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(validCreateNewAccountResult);

            try {
                await accountService.createNewAccount(validCreateNewAccountPayload);
            } catch (error: any) {
                expect(prismaService.account.findUnique).toHaveBeenCalledWith({
                    where: { email: validCreateNewAccountPayload.email },
                });
                expect(error.message).toBe('Email already in use');
            }
        });

        it('should throw an error if local auth provider is not found', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(null);
            mockPrismaService.authProvider.findUnique.mockResolvedValue(null);

            try {
                await accountService.createNewAccount(validCreateNewAccountPayload);
            } catch (error: any) {
                expect(prismaService.account.findUnique).toHaveBeenCalledWith({
                    where: { email: validCreateNewAccountPayload.email },
                });
                expect(prismaService.authProvider.findUnique).toHaveBeenCalledWith({ where: { name: 'Local' } });
                expect(error.message).toBe('Local auth provider not found');
            }
        });

        it('should throw an error if pending account status is not found', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(null);
            mockPrismaService.authProvider.findUnique.mockResolvedValue({ id: 1, name: 'Local' });
            mockPrismaService.accountStatus.findUnique.mockResolvedValue(null);

            try {
                await accountService.createNewAccount(validCreateNewAccountPayload);
            } catch (error: any) {
                expect(prismaService.account.findUnique).toHaveBeenCalledWith({
                    where: { email: validCreateNewAccountPayload.email },
                });
                expect(prismaService.authProvider.findUnique).toHaveBeenCalledWith({ where: { name: 'Local' } });
                expect(prismaService.accountStatus.findUnique).toHaveBeenCalledWith({ where: { name: 'Pending' } });
                expect(error.message).toBe('Pending account status not found');
            }
        });

        it('should throw an error if user account role is not found', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(null);
            mockPrismaService.authProvider.findUnique.mockResolvedValue({ id: 1, name: 'Local' });
            mockPrismaService.accountStatus.findUnique.mockResolvedValue({ id: 1, name: 'Pending' });
            mockPrismaService.accountRole.findUnique.mockResolvedValue(null);

            try {
                await accountService.createNewAccount(validCreateNewAccountPayload);
            } catch (error: any) {
                expect(prismaService.account.findUnique).toHaveBeenCalledWith({
                    where: { email: validCreateNewAccountPayload.email },
                });
                expect(prismaService.authProvider.findUnique).toHaveBeenCalledWith({ where: { name: 'Local' } });
                expect(prismaService.accountStatus.findUnique).toHaveBeenCalledWith({ where: { name: 'Pending' } });
                expect(prismaService.accountRole.findUnique).toHaveBeenCalledWith({ where: { name: 'User' } });
                expect(error.message).toBe('User account role not found');
            }
        });

        it('should throw an error if another error occurred in prisma service', async () => {
            mockPrismaService.account.findUnique.mockRejectedValue(new Error('Unexpected error'));

            try {
                await accountService.createNewAccount(validCreateNewAccountPayload);
            } catch (error: any) {
                expect(prismaService.account.findUnique).toHaveBeenCalledWith({
                    where: { email: validCreateNewAccountPayload.email },
                });
                expect(error.message).toBe('Unexpected error');
            }
        });
    });

    describe('findAccountByEmail', () => {
        it('should find account by email successfully', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(validCreateNewAccountResult);

            const result = await accountService.findAccountByEmail(validCreateNewAccountPayload.email);

            expect(prismaService.account.findUnique).toHaveBeenCalled();
            expect(result).toEqual(validCreateNewAccountResult);
        });

        it('should throw an error if account is not found', async () => {
            mockPrismaService.account.findUnique.mockResolvedValue(null);

            try {
                await accountService.findAccountByEmail(validCreateNewAccountPayload.email);
            } catch (error) {
                expect(prismaService.account.findUnique).toHaveBeenCalled();
                expect(error.message).toBe('Account not found');
            }
        });

        it('should throw an error if another error occurred in prisma service', async () => {
            mockPrismaService.account.findUnique.mockRejectedValue(new Error('Unexpected error'));

            try {
                await accountService.findAccountByEmail(validCreateNewAccountPayload.email);
            } catch (error: any) {
                expect(prismaService.account.findUnique).toHaveBeenCalled();
                expect(error.message).toBe('Unexpected error');
            }
        });
    });

    describe('findAccountByLogin', () => {
        it('should find account by login successfully', async () => {
            mockPrismaService.account.findFirst.mockResolvedValue(validFindAccountByLoginResult);

            const result = await accountService.findAccountByLogin(validFindAccountByLoginPayload.username);

            expect(prismaService.account.findFirst).toHaveBeenCalled();
            expect(result).toEqual(validFindAccountByLoginResult);
        });

        it('should throw an error if account is not found', async () => {
            mockPrismaService.account.findFirst.mockResolvedValue(null);

            try {
                await accountService.findAccountByLogin(validFindAccountByLoginPayload.username);
            } catch (error) {
                expect(prismaService.account.findFirst).toHaveBeenCalled();
                expect(error.message).toBe('Account not found');
            }
        });

        it('should throw an error if account is locked', async () => {
            mockPrismaService.account.findFirst.mockResolvedValue({
                ...validFindAccountByLoginResult,
                status: { id: 2, name: 'Locked' },
                lock_expires_at: mockLockExpiresAt,
            });

            try {
                await accountService.findAccountByLogin(validFindAccountByLoginPayload.username);
            } catch (error) {
                expect(prismaService.account.findFirst).toHaveBeenCalled();
                expect(error.message).toBe('Account is locked until: ' + mockLockExpiresAt);
            }
        });

        it('should throw an error if another error occurred in prisma service', async () => {
            mockPrismaService.account.findFirst.mockRejectedValue(new Error('Unexpected error'));

            try {
                await accountService.findAccountByLogin(validFindAccountByLoginPayload.username);
            } catch (error: any) {
                expect(prismaService.account.findFirst).toHaveBeenCalled();
                expect(error.message).toBe('Unexpected error');
            }
        });
    });

    describe('findAccountByKeyword', () => {
        it('should find account by keyword successfully', async () => {
            mockPrismaService.account.findFirst.mockResolvedValue(validFindAccountByKeywordResult);

            const result = await accountService.findAccountByKeyword(validFindAccountByKeywordPayload.keyword);

            expect(prismaService.account.findFirst).toHaveBeenCalled();
            expect(result).toEqual(validFindAccountByKeywordResult);
        });

        it('should throw an error if account is not found', async () => {
            mockPrismaService.account.findFirst.mockResolvedValue(null);

            try {
                await accountService.findAccountByKeyword(validFindAccountByKeywordPayload.keyword);
            } catch (error) {
                expect(prismaService.account.findFirst).toHaveBeenCalled();
                expect(error.message).toBe('Account not found');
            }
        });

        it('should throw an error if another error occurred in prisma service', async () => {
            mockPrismaService.account.findFirst.mockRejectedValue(new Error('Unexpected error'));

            try {
                await accountService.findAccountByKeyword(validFindAccountByKeywordPayload.keyword);
            } catch (error: any) {
                expect(prismaService.account.findFirst).toHaveBeenCalled();
                expect(error.message).toBe('Unexpected error');
            }
        });
    });

    describe('isLockedAccount', () => {
        function expectResult(account: any, expectedResult: boolean) {
            const result = accountService.isLockedAccount(account);
            expect(result).toBe(expectedResult);
        }

        it('should return true if account is locked and lock_expires_at is in the future', () => {
            expectResult({ status: { name: 'Locked' }, lock_expires_at: mockLockExpiresAt }, true);
        });

        it('should return false if account is not provided', () => {
            expectResult(null, false);
        });

        it('should return false if account status is undefined or null', () => {
            expectResult({}, false);
        });

        it('should return false if account status name is undefined or null', () => {
            expectResult({ status: {} }, false);
        });

        it('should return false if account status is not equal to `locked`', () => {
            expectResult({ status: { name: 'Pending' } }, false);
        });

        it('should return false if account is locked but lock_expires_at is not provided', () => {
            expectResult({ status: { name: 'Locked' } }, false);
        });

        it('should return false if account is locked but lock_expires_at is in the past', () => {
            expectResult({ status: { name: 'Locked' }, lock_expires_at: new Date() }, false);
        });
    });
});
