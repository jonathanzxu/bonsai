/*
    This API is used for changing a user's profile picture
 */

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import {NextResponse} from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/authOptions"

export const POST = async (request: any) => {

    const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const {newPicture} = await request.json();
    const email = ((session as any).user as any).email;
    const username = ((session as any).user as any).username;

    try {
        await connectDb();
        const user = await User.findOne({
            $or: [
                { email: email },
                { username: username }
            ]
        });
        console.log(user)
        if (!user) {
            return new NextResponse("Email not recognized", { status: 403 });
        }
        else {
            user.picture = newPicture;
            await user.save();
            return new NextResponse("Profile picture changed", { status: 200 });
        }
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}