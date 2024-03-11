import connectDb from "../../../lib/database";
import Task from "../../../lib/models/User";
import {NextResponse} from "next/server";

export async function PUT(request, {params}) {
    const { id } = params;
    const {newTitle: title, newDescription: description, newStatus: status, newUsers: users, newProject: project, newSubtasks: subtasks, newParent: parent, newdueDate: dueDate, newPriority: priority} = await request.json();
    await connectDb();
    await Task.findByIdAndUpdate(id, {title, description, status, users, project, subtasks, parent, dueDate, priority});
    return NextResponse.json({ message: "Task successfully updated."}, { status: 200 });
}

export async function GET(request, { params }) {
    const { id } = params; 
    await connectDb();
    const topic = await Task.findOne({_id: id});
    return NextResponse.json({ Task }, {status: 200});
}