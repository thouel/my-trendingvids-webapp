import Github from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';

export const options /* NextAuthOptions */ = {
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
        const user = { id: '42', name: 'obit', password: 'obit' };
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
};
