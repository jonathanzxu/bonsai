"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { removeFriend } from "../actions"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Friends = {
    picture: string,
    username : string
}

export const columns: ColumnDef<Friends>[] = [
    {
        accessorKey: "picture",
        header: "",
        cell: ({row}) =>{
            const imgURL:string = row.getValue("picture")
            return (
                <>
                <Avatar>
                    <AvatarImage src= {imgURL} />
                    <AvatarFallback></AvatarFallback>
                </Avatar>
                </>
    
            )
        }
    },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      
      const handleDeleteFriend = async (username: string) => { 
        await removeFriend(username)
        .then((res) => {
          if (res) {
            toast("Friend removed.")
          }
        });
      };
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-8 p-0 font-black">
              . . .
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="font-red" onClick={() => {
              handleDeleteFriend(row.getValue("username"))
            }}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
