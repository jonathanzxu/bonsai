/*
    This API is used for changing a user's username
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
    const {newUsername} = await request.json();
    const email = session.user.email;
    const username = session.user.username;

    try {
        await connectDb();
        const user = await User.findOne({email: email});
        if (!user) {
            return new NextResponse("Email not recognized", { status: 403 });
        }
        else if (user.username === newUsername) {
            return new NextResponse("Username cannot be the same", { status: 403 });
        }
        else {
            user.username = newUsername;
            await user.save();
            return new NextResponse("Username changed", { status: 200 });
        }
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}