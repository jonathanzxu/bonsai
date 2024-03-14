"use client";
import { Friends, columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getFriends, addFriend } from "@/app/actions";
import { toast } from "sonner";

    
export default function DemoPage() {
  const [friends, setFriends] = useState<any[]>([]);
  const [friendUsername, setFriendUsername] = useState("");

  useEffect(() => {
    getFriends().then((data) => {
      if (data) setFriends(data);
    });
  }, []);

  return (
    <>
      <div className="container mx-auto py-10">
        <DataTable columns={columns} data={friends} setData={setFriends} />
      </div>
      <div className="container flex-row w-full max-w-sm items-center space-x-2">
        <div className="container flex w-full max-w-full space-x-2">
          <Input
            className="flex-1"
            value={friendUsername}
            onChange={(e) => setFriendUsername(e.target.value)}
            placeholder="Username"
          />
          <Button onClick={() => {
            addFriend(friendUsername)
            .then((data) => {
              if (data) setFriends([...friends, data]);
              toast("Friend successfully added!");
            });
          }}>Add</Button>
        </div>
      </div>
    </>
  );
}
