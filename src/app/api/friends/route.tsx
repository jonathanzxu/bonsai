// API to get the information about friends

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";
import { auth } from "@/lib/auth";

export const POST = async (request: any) => {
    const session = await auth();
    console.log("Session: ", session)
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const {email, password, newUsername} = request.json();
    try {
        await connectDb();
        const user = await User.findOne({email: email});
        if (!user) {
            return new NextResponse("Email not recognized", { status: 403 });
        }
        
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}