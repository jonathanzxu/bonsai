/*
    This API is used for creating, updating, getting, and deleting tasks
 */

    import connectDb from "../../../lib/database";
    import User from "../../../lib/models/User";
    import bcrypt from "bcrypt";
    import {NextResponse} from "next/server";
    
export const GET = async (request: any) => {
    

    export const POST = async (request: any) => {
        const {email, password, newUsername} = request.json();
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
                const isCorrectPass = await bcrypt.compare(password, user.password);
                if (isCorrectPass) {
                    user.username = newUsername;
                    await user.save();
                    return new NextResponse("Username changed", { status: 200 });
                }
                else {
                    return new NextResponse("Incorrect password", { status: 403 });
                }
            }
        } catch (error: any) {
            return new NextResponse(error, { status: 500 });
        }
    }