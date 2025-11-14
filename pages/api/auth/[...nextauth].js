// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // simple check using env vars
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        if (!adminEmail || !adminPassword) {
          throw new Error('Admin not configured on server');
        }

        if (
          credentials.email === adminEmail &&
          credentials.password === adminPassword
        ) {
          // return user object - can include roles
          return { id: 1, name: 'Admin', email: adminEmail, role: 'admin' };
        }

        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/admin/signin' // custom sign-in page (we'll create)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role || 'admin';
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    }
  }
});
