import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = [
          {
            id: 1,
            name: "Admin User",
            email: "admin@crm.com",
            password: "admin123",
            role: "admin",
          },
          {
            id: 2,
            name: "Sales Manager",
            email: "manager@crm.com",
            password: "manager123",
            role: "manager",
          },
          {
            id: 3,
            name: "Sales Rep",
            email: "rep@crm.com",
            password: "rep123",
            role: "rep",
          },
        ];

        const user = users.find(
          u =>
            u.email === credentials.email &&
            u.password === credentials.password
        );

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
