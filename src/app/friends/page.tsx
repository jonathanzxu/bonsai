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



async function myFunction(){
  const session = await getServerSession(authOptions);
    if (!session) {
        return new NextResponse("Unauthorized", { status: 401 });
    }
    const username = "hello";
    return username;
}


async function getData(): Promise<Friends[]> {
  console.log('Hello There Second');
  // Fetch data from your API here.
  return [
    {
        picture : "https://avatars.githubusercontent.com/u/124599?v=4",
        username: "RandomPerson57"
    },
    {
        picture : "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fwww.ivywise.com%2Fcore%2Fwp-content%2Fuploads%2F2019%2F11%2FAdobeStock_316283362.jpeg&sp=1708990090T20c2a91a9521203440938e5267020a364f3462a5ebbd115f514001bbe41713e3",
        username: "OtherPerson5698"
    },
    // ...
  ]
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
