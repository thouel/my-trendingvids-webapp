import { PrismaAdapter } from '@auth/prisma-adapter';

export function MyPrismaAdapter(p /* PrismaClient */) {
  return {
    ...PrismaAdapter(p),
    async getUser(id) {
      console.log('getuserById', { id });
      const u = await p.user.findUnique({
        where: { id },
        include: {
          pinnedShows: {
            include: {
              networks: true,
            },
          },
        },
      });
      console.log('getUserById', { u });
      return u;
    },
    async getUserByEmail(email) {
      console.log('getUserByEmail', { email });
      const u = await p.user.findUnique({
        where: { email },
        include: {
          pinnedShows: {
            include: {
              networks: true,
            },
          },
        },
      });
      console.trace(`getUserByEmail ${u}`);
      return u;
    },
    async getUserByAccount(provider_providerAccountId) {
      console.log('getUserByAccount', { provider_providerAccountId });
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        include: {
          user: {
            include: {
              pinnedShows: {
                include: {
                  networks: true,
                },
              },
            },
          },
        },
      });
      console.log('getUserByAccount', { account });
      return account?.user ?? null;
    },
    async createVerificationToken(data) {
      console.log('createVerificationToken', { data });
      const verificationToken = await p.verificationToken.create({ data });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      5693;
      return verificationToken;
    },
    async useVerificationToken(identifier_token) {
      console.log('useVerificationToken', { identifier_token });
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
