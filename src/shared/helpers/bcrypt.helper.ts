import bcrypt from 'bcrypt';

export class BcryptHelper {
    static SALT_ROUNDS = 10;

    static async hash(raw: string): Promise<string> {
        return bcrypt.hash(raw, BcryptHelper.SALT_ROUNDS);
    }

    static async compare(raw: string, hashed: string): Promise<boolean> {
        return bcrypt.compare(raw, hashed);
    }
}
