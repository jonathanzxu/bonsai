/*
    This API is used for changing a user's email address
 */

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import {NextResponse} from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = async (request: any) => {

    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const {newEmail} = await request.json();
    const email = session.user.email;
    const username = session.user.username;
    try {
        await connectDb();
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });
        if (!user) {
            return new NextResponse("Email not recognized", { status: 403 });
        }
        else if (email === newEmail) {
            return new NextResponse("Email cannot be the same", { status: 403 });
        }
        else {
            user.email = newEmail;
            await user.save();
            return new NextResponse("Email changed", { status: 200 });
        }
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}