"use client"

import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Friends = {
    username : string,
    id: string,
}

export const columns: ColumnDef<Friends>[] = [
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "id",
    header: "ID",
  },
]
