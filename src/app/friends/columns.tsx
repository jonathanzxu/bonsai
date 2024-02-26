"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Friends = {
    avatarURL: string,
    username : string,
    id: string,
}

export const columns: ColumnDef<Friends>[] = [
    {
        accessorKey: "avatarURL",
        header: "",
        cell: ({row}) =>{
            const imgURL:string = row.getValue("avatarURL")
            return (
                <>
                <Avatar>
                    <AvatarImage src= {imgURL} />
                    <AvatarFallback>CN</AvatarFallback>
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
    accessorKey: "id",
    header: "ID",
  },
]
