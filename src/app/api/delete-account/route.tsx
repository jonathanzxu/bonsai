/*
    This API is used for deleting a user's account
 */

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import {NextResponse} from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/authOptions"

export const DELETE = async () => {

    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
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
            return new NextResponse("Email or username not recognized", { status: 403 });
        }
        else {
            await User.deleteOne(user);
            return new NextResponse("User deleted", { status: 200 });
        }
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}