import { AuthSignupDto } from '@/modules/auth/dto/auth-signup.dto';

export const mockAccountService = {
    createNewAccount: jest.fn(),
    findAccountByEmail: jest.fn(),
    findAccountByLogin: jest.fn(),
};

export const mockAccountSessionService = {
    createNewAccountSession: jest.fn(),
};

export const validSignupPayload: AuthSignupDto = {
    email: 'test@tester.gmail.com',
    password: '123Jest!@#',
    username: 'netnado tester',
};

export const validSignupResult = {
    id: 1,
    email: 'test@tester.gmail.com',
    username: 'netnado tester',
};

export const validLoginPayload = {
    authLoginDto: {
        keyword: 'test@tester.gmail.com',
        password: '123Jest!@#',
    },
    userAgent: 'user-agent',
    ipAddress: '127.0.0.1',
};

export const validLoginResult = {
    account: { ...validSignupResult },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
};

export const validLoginSessionResult = {
    id: 1,
    userAgent: 'user-agent',
    ipAddress: '127.0.0.1',
};
