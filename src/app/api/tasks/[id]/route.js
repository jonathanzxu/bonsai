import connectMongoDB from "../../../../libs/mongodb";
import Task from "../../../../models/task";

export async function PUT(request, {params}) {
    const { id } = params;
    const {newName: name, newDescription: description, newPriority: priority} = await request.json();
    await connectMongoDB();
    await Task.findByIdAndUpdate(id, {name, description, prioirty});
    return NextResponse.json({ message:: "Task successfully updated."}, { status: 200 });
}

export async function GET(request, { params }) {
    const { id } = params; 
    await connectMongoDB();
    const topic = await Topic.findOne({_id: id});
    return NextResponse.json({ task }, {status: 200});
}