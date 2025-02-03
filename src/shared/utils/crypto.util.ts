import crypto from 'crypto';

export class CryptoUtil {
    static generateRSAKeysForAccess() {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem',
            },
        });
        return { publicKey, privateKey };
    }

    static generateUUID = () => {
        return crypto.randomUUID();
    };

    static generatePublicId(length: number = 10): string {
        return crypto.randomBytes(length).toString('hex');
    }
}
