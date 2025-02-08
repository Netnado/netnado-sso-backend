import { CreateNewAccountDto } from '@/modules/account/dto/create-new-account.dto';

export const mockPrismaService = {
    account: {
        create: jest.fn(),
        findUnique: jest.fn(),
    },
    accountRole: {
        findUnique: jest.fn(),
    },
    accountStatus: {
        findUnique: jest.fn(),
    },
    authProvider: {
        findUnique: jest.fn(),
    },

    $connect: jest.fn(),
    $disconnect: jest.fn(),
};

export const mockBcryptHelper = {
    hash: jest.fn().mockImplementation(() => '$2a$10$LLsA7kzvfpCddPDT7Zpfz.vcSRAazKVzMdJWd12ufZIVeR0BMDUSW'),
};

export const mockCryptoUtil = {
    generatePublicId: jest.fn().mockImplementation(() => 'public_id'),
    generateRSAKeysForAccess: jest
        .fn()
        .mockImplementation(() => ({ privateKey: 'private_key', publicKey: 'public_key' })),
};

export const validCreateNewAccountPayload: CreateNewAccountDto = {
    email: 'test@tester.gmail.com',
    password: '123Jest!@#',
    username: 'netnado tester',
};

export const validCreateNewAccountParameters = {
    data: {
        email: 'test@tester.gmail.com',
        password: '$2a$10$LLsA7kzvfpCddPDT7Zpfz.vcSRAazKVzMdJWd12ufZIVeR0BMDUSW',
        username: 'netnado tester',
        public_id: 'public_id',
        public_key: 'public_key',
        private_key: 'private_key',
        status_id: 1,
        auth_provider_id: 1,
        role_id: 1,
    },
};

export const validCreateNewAccountResult = {
    id: 1,
    email: 'test@tester.gmail.com',
    username: 'netnado tester',
    public_id: 'public_id',
    status: { id: 1, name: 'Pending' },
    auth_provider: { id: 1, name: 'Local' },
    role: { id: 1, name: 'User' },
};

export function validFindAccountByEmailParameters(email: string) {
    return {
        where: { email: email },
        include: {
            status: true,
            auth_provider: true,
            role: true,
        },
    };
}
