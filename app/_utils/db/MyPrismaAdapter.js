import { Prisma } from '@prisma/client';
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
    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: {
            identifier: identifier_token.identifier,
            token: identifier_token.token,
          },
        });
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (error.code === 'P2025') return null;
        throw error;
      }
    },
  };
}
