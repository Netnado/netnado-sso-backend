import { PrismaService } from '@/prisma/prisma.service';
import { BcryptHelper } from '@/shared/helpers/bcrypt.helper';
import { LodashHelper } from '@/shared/helpers/lodash.helper';
import { CryptoUtil } from '@/shared/utils/crypto.util';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AccountService {
    constructor(private readonly prismaService: PrismaService) {}

    async createNewAccount({
        email,
        password,
        username,
    }: {
        email: string;
        password: string;
        username: string;
    }): Promise<any> {
        const existingAccount = await this.prismaService.account.findUnique({
            where: { email },
        });
        if (existingAccount) {
            throw new Error('Email already in use');
        }

        const hashedPassword: string = await BcryptHelper.hash(password);
        const publicId: string = CryptoUtil.generatePublicId();

        const localAuthProvider = await this.prismaService.authProvider.findUnique({ where: { name: 'Local' } });
        if (!localAuthProvider) {
            throw new Error('Local auth provider not found');
        }
        const pendingAccountStatus = await this.prismaService.accountStatus.findUnique({ where: { name: 'Pending' } });
        if (!pendingAccountStatus) {
            throw new Error('Pending account status not found');
        }
        const userAccountRole = await this.prismaService.accountRole.findUnique({ where: { name: 'User' } });
        if (!userAccountRole) {
            throw new Error('User account role not found');
        }

        const { privateKey, publicKey } = CryptoUtil.generateRSAKeysForAccess();
        const result = await this.prismaService.account.create({
            data: {
                email,
                password: hashedPassword,
                username,
                public_id: publicId,
                public_key: publicKey.toString(),
                private_key: privateKey.toString(),
                status_id: pendingAccountStatus.id,
                auth_provider_id: localAuthProvider.id,
                role_id: userAccountRole.id,
            } as any,
        });

        const resultData = LodashHelper.omit(result, [
            'password',
            'public_key',
            'private_key',
            'status_id',
            'auth_provider_id',
            'role_id',
        ]);
        return {
            ...resultData,
            status: { id: pendingAccountStatus.id, name: pendingAccountStatus.name },
            auth_provider: { id: localAuthProvider.id, name: localAuthProvider.name },
            role: { id: userAccountRole.id, name: userAccountRole.name },
        };
    }

    async findAccountByEmail(email: string) {
        return this.prismaService.account.findUnique({
            where: { email },
        });
    }
}
