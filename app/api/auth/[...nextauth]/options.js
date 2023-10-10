import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import prisma from '@/db/db-prisma';
import { MyPrismaAdapter } from '@/db/MyPrismaAdapter';

export const options /* NextAuthOptions */ = {
  adapter: MyPrismaAdapter(prisma),
  session: {
    // Choose how you want to save the user session.
    // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
    // If you use an `adapter` however, we default it to `"database"` instead.
    // You can still force a JWT session by explicitly defining `"jwt"`.
    // When using `"database"`, the session cookie will only contain a `sessionToken` value,
    // which is used to look up the session in the database.
    strategy: 'jwt',

    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 24 * 60 * 60, // 24 hours

    // Seconds - Throttle how frequently to write to database to extend a session.
    // Use it to limit write operations. Set to 0 to always update the database.
    // Note: This option is ignored if using JSON Web Tokens
    updateAge: 60 * 60, // 60 minutes

    // The session token is usually either a random UUID or string, however if you
    // need a more customized session token string, you can define your own generate function.
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString('hex');
    },
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds
    maxAge: 60 * 60 * 24,
  },
  providers: [
    Github({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: 'Credentials',
      credentials: {
        username: {
          label: 'Username:',
          type: 'text',
          placeholder: 'your-cool-username',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: '***',
        },
      },
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials
        const user = {
          id: '42',
          name: 'obit',
          email: 'obit@obit.eu',
          password: 'obit',
        };
        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      console.log('jwt callback', { token, user, session, trigger });

      // if an update occurs from the client side, we need to replicate it
      // in token, so it is persisted in session function below
      if (trigger === 'update') {
        token.pinnedShowsIDs = session.pinnedShowsIDs;
        token.pinnedShows = session.pinnedShows;
      }

      // user is filled only when signing in/up
      if ((trigger === 'signIn' || trigger === 'signUp') && user) {
        // pass in from user to token
        return {
          ...token,
          id: user.id,
          pinnedShowsIDs: user.pinnedShowsIDs,
          pinnedShows: user.pinnedShows,
        };
      }
      return token;
    },
    async session({ session, token, user }) {
      console.log('session callback', { session, token, user });

      // pass in from token to session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          pinnedShowsIDs: token.pinnedShowsIDs,
          pinnedShows: token.pinnedShows,
        },
      };
    },
  },
};
