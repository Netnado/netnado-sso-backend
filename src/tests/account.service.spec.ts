import { AccountService } from '@/modules/account/account.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
    mockPrismaService,
    validCreateNewAccountParameters,
    validCreateNewAccountPayload,
    validCreateNewAccountResult,
} from './mocks/account.mock';
import { Test } from '@nestjs/testing';
import { CryptoUtil } from '@/shared/utils/crypto.util';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';

describe('AccountService', () => {
    let accountService: AccountService;
    let prismaService: PrismaService;

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
    });
});
