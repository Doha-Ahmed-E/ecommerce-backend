import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials)
            {
                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });
                if (user && bcrypt.compareSync(credentials.password, user.password))
                {
                    return { id: user.id, username: user.username, email: user.email };
                }
                return null;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: 'jwt' },
    callbacks: {
        async jwt({ token, user })
        {
            if (user)
            {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token })
        {
            if (token)
            {
                session.user.id = token.id;
            }
            return session;
        },
    },
};

export default NextAuth(authOptions);