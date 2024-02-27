"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Friends = {
    avatarURL: string,
    username : string,
    id: string,
}

export const columns: ColumnDef<Friends>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
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
