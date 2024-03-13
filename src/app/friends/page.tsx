import { Friends, columns } from "./columns"
import { DataTable } from "./data-table"
import { FriendForm } from "./form";



import { getSession } from "next-auth/react";
import {useEffect, useState} from "react";

import connectDb from "../../lib/database";
import User from "../../lib/models/User";
import {NextResponse} from "next/server";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { auth } from "@/lib/auth";



async function myFunction(){
  const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const username = "hello";
    return username;
}


async function getData(): Promise<Friends[]> {

  // Fetch data from your API here.
    
  const session = await getServerSession(authOptions);
  if (!session) {
      return ([]);
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

        const friendsInfo = [];
        const friendsArray = user.friends;
        for(let i = 0; i < friendsArray.length; ++i){
            const temp = await User.findOne({_id: friendsArray[i]}).select({username:1, picture:1});
            if(!temp){
              const index = user.friends.indexOf(friendsArray[i]);
              user.friends.splice(index, 1);
              await user.save();
            }
            else{
                friendsInfo.push(temp);
            }
        }
        return friendsInfo;

      } catch (error: any) {
        return ([]);
    }

}


export default async function DemoPage() {
  const data = await getData()

  const trial = await myFunction();
  //const trial = 'something';


  return (
    <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
    <div className = "container flex-row w-full max-w-sm items-center space-x-2">

    <div className="container flex w-full max-w-full space-x-2">
      <FriendForm/>
    </div>
    </div>
    </>
  )
}
