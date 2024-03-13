/*
    This API is used for creating, updating, getting, and deleting tasks
*/

import connectDb from "../../../lib/database";
import Task from "../../../lib/models/Task";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, description, priority } = await request.json();
    await connectDb();
    await Task.create({name, description, priority});
    return NextResponse.json({message: "Task successfuly created."}, {status: 201});
}