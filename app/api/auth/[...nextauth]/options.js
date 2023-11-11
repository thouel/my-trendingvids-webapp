import Github from 'next-auth/providers/github';
import Twitch from 'next-auth/providers/twitch';
import EmailProvider from 'next-auth/providers/email';
import { prisma } from '../../../utils/db/db-prisma';
import { MyPrismaAdapter } from 'app/utils/db/MyPrismaAdapter';
import { randomBytes, randomUUID } from 'crypto';
import { getOne } from 'app/utils/db/users';

const myPrismaAdapter = MyPrismaAdapter(prisma);

export const options /* NextAuthOptions */ = {
  debug: true,
  adapter: myPrismaAdapter,
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    verifyRequest: '/auth/verify-request',
  },
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
      clientId: process.env.NEXTAUTH_GITHUB_ID,
      clientSecret: process.env.NEXTAUTH_GITHUB_SECRET,
    }),
    Twitch({
      clientId: process.env.TWITCH_ID,
      clientSecret: process.env.TWITCH_SECRET,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 10 * 60, // 10 minutes => How long email links are valid for
    }) /* 
    Credentials({
      name: 'Credentials',
      async authorize(credentials) {
        // This is where you need to retrieve user data
        // to verify with credentials

        // Fetch User by email : prismaAdapter.getUserByEmail
        const user = await myPrismaAdapter.getUserByEmail(credentials.email);
        console.log('user', { user });
        // User exists
        if (user) {
          // Check if User has password field
          if (user.password !== undefined) {
            // User has password
            // Compare hashed versions of passwords
            const hashedInput = createHash('sha1')
              .update(credentials.password)
              .digest('hex');

            console.log('hashedInput', { hashedInput });
            console.log('hashedPassword', user.password);

            // return user if the comparison is ok
            // return null if not
            return hashedInput === user.password ? user : null;
          } else {
            // User exists BUT has no password (then it is an OAuth user)
            // return null
            return null;
          }
        } else {
          // User does not exist
          // return null
          return null;
        }
      },
    }) ,*/,
  ],
  events: {
    async error({ e }) {
      console.log('ERROR', { e });
    },
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      // console.log('jwt callback', { token, user, session, trigger });

      // if an update occurs from the client side, we need to replicate it
      // in token, so it is persisted in session function below
      if (trigger === 'update') {
        token.pinnedShowsIDs = session.pinnedShowsIDs;
        token.pinnedShows = session.pinnedShows;
      }

      // user is filled only when signing in/up
      if ((trigger === 'signIn' || trigger === 'signUp') && user) {
        let u = null;
        if (!user.pinnedShows) {
          // console.log('Fetching pinnedShows');
          try {
            u = await getOne(user.email);
          } catch (e) {
            console.error(e);
            u = { pinnedShows: [] };
          }
          // console.log('Fetched pinnedShows', { u });
        }

        // pass in from user to token
        return {
          ...token,
          id: user.id,
          pinnedShowsIDs: user.pinnedShowsIDs,
          pinnedShows: user.pinnedShows ?? u.pinnedShows,
        };
      }
      return token;
    },
    // eslint-disable-next-line no-unused-vars
    async session({ session, token, user }) {
      // console.log('session callback', { session, token, user });

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
