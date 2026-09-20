import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No account found with this email");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        // Update last active
        await prisma.user.update({
          where: { id: user.id },
          data: { lastActiveAt: new Date() },
        });

        return {
          id: user.id,
          name: user.name || "Student Developer",
          email: user.email,
          image: user.avatar,
          careerGoal: user.careerGoal,
          careerLevel: user.careerLevel,
          streakCount: user.streakCount,
          totalXp: user.totalXp,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.careerGoal = (user as any).careerGoal;
        token.careerLevel = (user as any).careerLevel;
        token.streakCount = (user as any).streakCount;
        token.totalXp = (user as any).totalXp;
      }

      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.careerGoal = session.careerGoal || token.careerGoal;
        token.careerLevel = session.careerLevel || token.careerLevel;
        token.streakCount = session.streakCount ?? token.streakCount;
        token.totalXp = session.totalXp ?? token.totalXp;
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).careerGoal = token.careerGoal as string;
        (session.user as any).careerLevel = token.careerLevel as string;
        (session.user as any).streakCount = token.streakCount as number;
        (session.user as any).totalXp = token.totalXp as number;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "devpulse-super-secret-jwt-key-32-chars-minimum-for-security",
};
