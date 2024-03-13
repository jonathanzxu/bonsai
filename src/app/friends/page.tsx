"use client";
import { Friends, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getFriends, addFriend } from "@/app/actions";

function getData(): Friends[] {
  // Fetch data from your API here.
  return [
    {
        avatarURL : "https://avatars.githubusercontent.com/u/124599?v=4",
        id: "728ed52f",
        username: "RandomPerson57"
    },
    {
        avatarURL : "https://www.startpage.com/av/proxy-image?piurl=https%3A%2F%2Fwww.ivywise.com%2Fcore%2Fwp-content%2Fuploads%2F2019%2F11%2FAdobeStock_316283362.jpeg&sp=1708990090T20c2a91a9521203440938e5267020a364f3462a5ebbd115f514001bbe41713e3",
        id: "728eej52f",
        username: "OtherPerson5698"
    },
    // ...
  ]
}

export default function DemoPage() {
  const data = getData();
  const [friendUsername, setFriendUsername] = useState("");

  return (
    <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
    <div className = "container flex-row w-full max-w-sm items-center space-x-2">
    <h3>Add Friend</h3>
    <div className="container flex w-full max-w-full space-x-2">
      <Input className="flex-1" value={friendUsername} onChange={(e) => setFriendUsername(e.target.value)} placeholder="Username" />
      <Button onClick={() => addFriend(friendUsername)}>Add</Button>
    </div>
    </div>
    </>
  )
}
