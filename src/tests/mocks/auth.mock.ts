import { AuthSignupDto } from '@/modules/auth/dto/auth-signup.dto';

export const mockAccountService = {
    findAccountByEmail: jest.fn(),
    createNewAccount: jest.fn(),
};

export const validSignupPayload: AuthSignupDto = {
    email: 'test@tester.gmail.com',
    password: '123Jest!@#',
    username: 'netnado tester',
};

export const validSignupResult = {
    id: 1,
    ...validSignupPayload,
};
