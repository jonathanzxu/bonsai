"use client";
import { Friends, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { getFriends, addFriend } from "@/app/actions";

function getData(): Friends[] {

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
    
export default function DemoPage() {
  const data = getData();
  const [friendUsername, setFriendUsername] = useState("");

  const trial = await myFunction();
  //const trial = 'something';


  return (
    <>
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
    <div className = "container flex-row w-full max-w-sm items-center space-x-2">

    <div className="container flex w-full max-w-full space-x-2">
      <Input className="flex-1" value={friendUsername} onChange={(e) => setFriendUsername(e.target.value)} placeholder="Username" />
      <Button onClick={() => addFriend(friendUsername)}>Add</Button>
    </div>
    </div>
    </>
  )
}
