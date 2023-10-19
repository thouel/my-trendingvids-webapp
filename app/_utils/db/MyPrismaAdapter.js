import { PrismaAdapter } from '@auth/prisma-adapter';

export function MyPrismaAdapter(p /* PrismaClient */) {
  return {
    ...PrismaAdapter(p),
    async getUserByAccount(provider_providerAccountId) {
      console.log('in getUserByAccount', { provider_providerAccountId });
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        include: {
          user: {
            include: {
              pinnedShows: true,
            },
          },
        },
      });
      console.log('Retrieved account', { account });
      return account?.user ?? null;
    },
  };
}
