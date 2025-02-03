import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import accountStatuses from './accountStatuses.json';
import authProviders from './authProviders.json';
import accountRoles from './accountRoles.json';

async function main() {
    // Insert Account Statuses
    const statusQueries = accountStatuses.map(status =>
        prisma.accountStatus.upsert({
            where: { name: status.name },
            update: {},
            create: { ...status },
        }),
    );

    // Insert Auth Providers
    const authProviderQueries = authProviders.map(provider =>
        prisma.authProvider.upsert({
            where: { name: provider.name },
            update: {},
            create: { ...provider },
        }),
    );

    // Insert Account Roles
    const accountRolesQueries = accountRoles.map(role =>
        prisma.accountRole.upsert({
            where: { name: role.name },
            update: {},
            create: { ...role },
        }),
    );

    // Run transactions
    await prisma.$transaction([...statusQueries, ...authProviderQueries, ...accountRolesQueries]);

    console.log('Database seeded! 🚀');
}

main()
    .catch(e => console.error('Error seeding database:', e))
    .finally(async () => {
        await prisma.$disconnect();
    });
