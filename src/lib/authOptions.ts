import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/lib/models/User";
import connectDb from "@/lib/database";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";
import NextAuth, {Account, Profile, User as AuthUser} from "next-auth";

export const authOptions: any = {
    pages: {
        signIn: "/login",
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        }),
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: {label: "Email:", type: "text"},
                username: {label: "Username:", type: "text"},
                password: {label: "Password:", type: "password"},
                picture: {label: "Picture:", type: "text"},
            },
            async authorize(credentials: any) {
                try {
                    await connectDb();
                    const user = await User.findOne({email: credentials.email}) || await User.findOne({username: credentials.username});
                    if (user) {
                        const isCorrectPass = await bcrypt.compare(credentials.password, user.password);
                        if (isCorrectPass) return user;
                    }
                } catch (error: any) {
                    return new NextResponse(error, { status: 500 });
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }: { user: AuthUser; account: Account, profile: Profile }) {
            if (account?.provider === "credentials") { return true; }
            if (account?.provider === "google") {
                try {
                    await connectDb();
                    const foundUser = await User.findOne({email: profile.email});
                    if (!foundUser) {
                        const newUser = new User(
                            {
                                email: profile.email,
                                username: profile.name,
                                picture: profile.image
                            }
                        );
                        newUser.save();
                    }
                    return true;
                } catch (error) { return false; }
            }
        },
        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token._id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.picture = user.picture;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = token;
            return session;
        }
    }
}