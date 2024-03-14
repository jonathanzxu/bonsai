/*
    This API is used for logging in with username/password and login providers
 */

import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials"
import User from "@/lib/models/User";
import connectDb from "@/lib/database";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";
import NextAuth, {Account, Profile, User as AuthUser} from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };