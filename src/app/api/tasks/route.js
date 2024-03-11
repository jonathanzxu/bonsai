/*
    This API is used for creating, updating, getting, and deleting tasks
*/

import connectDb from "../../../lib/database";
import Task from "../../../lib/models/User";
import {NextResponse} from "next/server";

export async function POST(request) {
    const { title, description, status, users, project, subtasks, parent, dueDate, priority } = await request.json();
    await connectDb();
    await Task.create({title, description, status, users, project, subtasks, parent, dueDate, priority});
    return NextResponse.json({message: "Task successfuly created."}, {status: 201});
}

export async function GET() {
    await connectDb();
    const tasks = await Task.find();
    return NextResponse.json({ tasks });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectDb();
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: "Task successfully deleted." }, { sttaus: 200});
}

