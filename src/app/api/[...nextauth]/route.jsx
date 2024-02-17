/*
    This API is used for logging in with username/password and login providers
 */

import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import User from "../../../lib/models/User";
import connectDb from "../../../lib/database";
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET
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
            async authorize(credentials) {
                try {
                    await connectDb();
                    const user = await User.findOne({email: credentials.email}) || await User.findOne({username: credentials.username});
                    if (user) {
                        const isCorrectPass = await bcrypt.compare(credentials.password, user.password);
                        if (isCorrectPass) return user;
                    }
                } catch (error) { throw new Error(error) }
            },
        }),
    ],
    callbacks: {
        async signIn(user, account, profile) {
            if (account?.provider === "credentials") { return true; }
            if (account?.provider === "google") {
                try {
                    await connectDb();
                    const foundUser = await User.findOne({email: profile.email}) || await User.findOne({username: profile.username});
                    if (!foundUser) {
                        const newUser = new User(
                            {
                                email: profile.email,
                                username: profile.username,
                                picture: profile.picture
                            }
                        );
                        newUser.save();
                    }
                    return true;
                } catch (error) { return false; }
            }
        }
    }
}

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };