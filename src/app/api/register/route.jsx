/*
    This API is used for registering a new user to the database using email, username, and password method. It expects a JSON of the form data.
 */

import connectDb from "../../../lib/database";
import User from "../../../lib/models/User";
import bcrypt from "bcrypt"
import {NextResponse} from "next/server";

export const POST = async (request) => {
    const {email, username, password, picture} = request.json();
    try {
        await connectDb();
        let user = await User.findOne({email: email}) || await User.findOne({username: username}); // Check if user already exists
        if (user) {
            return new NextResponse(JSON.stringify({error: 'Email or username already exists'}), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
        else {
            user = new User(
                {
                    email: email,
                    username: username,
                    password: await bcrypt.hash(password, 11),
                    picture: picture
                }
            );
            await user.save();
            return new NextResponse(JSON.stringify({error: 'User successfully registered'}), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        }
    } catch (error) {
        return new NextResponse(JSON.stringify(error), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}