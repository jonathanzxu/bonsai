/*
    This API is used for registering a new user to the database using email, username, and password method. It expects a JSON of the form data.
 */

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import bcrypt from "bcrypt";
import {NextResponse} from "next/server";

export const POST = async (request: any) => {
    const {email, username, password, picture} = await request.json();
    try {
        await connectDb();
        const user = await User.findOne({email: email}) || await User.findOne({username: username}); // Check if user already exists
        if (user) {
            return new NextResponse("Email or username already exists", { status: 400 });
        }
        else {
            const newUser = new User(
                {
                    email: email,
                    username: username,
                    password: await bcrypt.hash(password, 11),
                    picture: picture
                }
            );
            await newUser.save();
            return new NextResponse("User successfully registered", { status: 200 });
        }
    } catch (error: any) {
        return new NextResponse(error, { status: 500 });
    }
}