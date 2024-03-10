/*
    This API is used for creating, updating, getting, and deleting tasks
*/

import connectMongoDB from "../../../../libs/mongodb";
import Task from "../../../../models/task";
import { NextResponse } from "next/server";

export async function POST(request) {
    const { name, description, priority } = await request.json();
    await connectMongoDB();
    await Task.create({name, description, priority});
    return NextResponse.json({message: "Task successfuly created."}, {status: 201});
}

export async function GET() {
    await connectMongoDB();
    const tasks = await Task.find();
    return NextResponse.json({ topics });
}

export async function DELETE(request) {
    const id = request.nextUrl.searchParams.get("id");
    await connectMongoDB();
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: "Task successfully deleted." }, { sttaus: 200});
}

