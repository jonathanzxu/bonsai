/*
    This API is used for changing a user's email address
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
        const {newFriend} = await request.json();
        const email = ((session as any).user as any).email;
        const username = ((session as any).user as any).username;
        if(newFriend === username){
            return new NextResponse("Can't friend yourself", { status: 402 });
        }
        try {
            await connectDb();
            const user = await User.findOne({
                $or: [
                    { email: email },
                    { username: username }
                ]
            });
            const friendUser = await User.findOne({username: newFriend});
            if (!user) {
                return new NextResponse("Email not recognized", { status: 403 });
            }
            else if (!friendUser) {
                return new NextResponse("Account Doesn't Exist", { status: 403 });
            }
            else if(user.friends.includes(friendUser._id)){
                return new NextResponse("Account is already friend", { status: 403 });
            }
            else {
                const friendID = friendUser._id;
                user.friends.push(friendID);
                await user.save();
                return new NextResponse("Friend Added", { status: 200 });
            }
        } catch (error: any) {
            return new NextResponse(error, { status: 500 });
        }
    }