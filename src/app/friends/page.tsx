import { Friends, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Friends[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      username: "RandomPerson57"
    },
    // ...
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
