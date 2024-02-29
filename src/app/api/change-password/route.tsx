/*
    This API is used for changing a user's password
 */

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";

export const POST = async (request: any) => {
    const {email, oldPassword, newPassword} = request.json();
    try {
        await connectDb();
        const user = await User.findOne({email: email});
        if (!user) {
            return new NextResponse("Email not recognized", { status: 403 });
        }
        else {
            const isCorrectPass = await bcrypt.compare(oldPassword, user.password);
            if (isCorrectPass) {
                user.password = await bcrypt.hash(newPassword, 11);
                await user.save();
                return new NextResponse("Password changed", { status: 200 });
            }
            else {
                return new NextResponse("Incorrect password", { status: 403 });
            }
        }
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}