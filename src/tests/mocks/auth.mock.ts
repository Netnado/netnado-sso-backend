import { AuthSignupDto } from '@/modules/auth/dto/auth-signup.dto';

export const mockAccountService = {
    createNewAccount: jest.fn(),
    findAccountByEmail: jest.fn(),
    findAccountByLogin: jest.fn(),
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
    keyword: 'test@tester.gmail.com',
    password: '123Jest!@#',
};

export const validLoginResult = {
    account: { ...validSignupResult },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
};
