/*
    This API is used for creating, updating, getting, and deleting tasks
*/

import connectDb from "../../../../lib/database";
import Task from "../../../../lib/models/Task";
import { NextResponse } from "next/server";

export async function PUT(request: any, {params}) {
    const { id } = params;
    const {newName: name, newDescription: description, newPriority: priority} = await request.json();
    await connectDb();
    await Task.findByIdAndUpdate(id, {name, description, priority});
    return NextResponse.json({ message: "Task successfully updated."}, { status: 200 });
}

export async function GET(request: any, { params }) {
    const { id } = params; 
    await connectDb();
    const task = await Task.findOne({_id: id});
    return NextResponse.json({ task }, {status: 200});
}