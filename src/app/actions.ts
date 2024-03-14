"use server"
import connectDb from "@/lib/database"
import Task from "@/lib/models/Task"
import Project from "@/lib/models/Project"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import User from "@/lib/models/User"

// util for building tree from mongodb graphlookup
function list_tree_lookup(keys: any, data: any, depth=0) {
    const keystrings = keys.map((a: any) => a.toString());
    let result : any[] = [];
    data.forEach((a: any) => {
        if(a['depth'] == depth && keystrings.includes(a['_id'].toString())) {
            let b = a;
            b['children'] = list_tree_lookup(b['subtasks'], data, depth+1);
            delete b['depth'];
            result.push(b);
        }
    });
    return result;
}

export async function createTask(parentId: String, title: String, description: String, dueDate: Date, priority: Number = 3, status: String = "todo", users: String[] = []) {
    const session = await getServerSession(authOptions);
    await connectDb();
    const user = await User.findOne({
        username: (session as any).user.username
    });
    if (!user) return;
    const parentTask = await Task.findById(parentId);
    if (!parentTask) return;
    const task = await Task.create({
        title: title,
        description: description,
        project: parentTask.project,
        parent: parentTask._id,
        dueDate: dueDate,
        priority: priority,
        status: status,
        users: users,
    });
    await Task.findByIdAndUpdate(parentId, {
        subtasks: [...parentTask.subtasks, task._id]
    });
    console.log("task", task);
    return task.toObject();
}

export async function editTask(taskId: String, title: String, description: String, dueDate: Date, priority: Number, status: String, users: String[]) {
    await connectDb();
    
    const task = await Task.findByIdAndUpdate(taskId, {
        title: title,
        description: description,
        dueDate: dueDate,
        priority: priority,
        status: status,
        users: users,
    });
    return task.toObject();
}

export async function deleteTask(taskId: String) {
    await connectDb();
    const task = await Task.findByIdAndDelete(taskId);
    if (!task) return;
    const parent = await Task.findById(task.parent);
    await Task.findByIdAndUpdate(task.parent, {
        subtasks: (parent as any).subtasks.filter((a: any) => a.toString() != taskId)
    });
    return task.toObject();
}

export async function createProject(name: String, description: String, members: String[]) {
    const session = await getServerSession(authOptions);
    await connectDb();
    const user = await User.findOne({
        username: (session as any).user.username
    });
    if (!user) return;
    const task = await Task.create({
        title: name,
        description: description,
        users: members,
    });
    const project = await Project.create({
        name: name,
        members: members,
        root: task._id
    });
    await Task.findByIdAndUpdate(task._id, {
        project: project._id,
    });
    console.log("project", project);
    return project.toObject();
}

export async function editProject(projectId: String, name: String, description: String, members: String[]) {
    await connectDb();
    const project = await Project.findByIdAndUpdate(projectId, {
        name: name,
        description: description,
        members: members,
    });
    return project.toObject();
}

export async function deleteProject(projectId: String) {
    await connectDb();
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) return;
    await Task.findByIdAndDelete((project as any).root);
    return project.toObject();
}

//get all projects and full subtask trees
// returns [
//     project1,
//     project2
// ]
export async function getAllTasks() {
    const session = await getServerSession(authOptions);
    await connectDb();
    if (!session || !(session as any).user) return;
    const user = await User.findOne({
        username: (session as any).user.username
    });
    if (!user) return;
    const projects = await Project.find({
        members: {
            $elemMatch: {
                $eq: user._id,
            }
        }
    });
    console.log("projects", projects)
    const projectTrees: any = [];
    // expand subtasks for every project
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const tree = await Task.aggregate([{
            "$graphLookup": {
                "from": "tasks",
                "startWith": project.root,
                "connectFromField": "_id",
                "connectToField": "parent",
                "as": "children",
                "depthField": "depth"
            }
        }
        ]);
        console.log("tree", project.root, tree);
        const newMembers = await Promise.all(project.members.map(async (userId: any) => {
            const user = await User.findById(userId);
            return user;
        }));
        let index = 0;
        tree.forEach((a: any, i: number) => {
            if (a._id.toString() == project.root.toString()) {
                index = i;
            }
        });
        for (const a of tree[index].children) {
            a.users = await Promise.all(a.users.map(async (userId: any) => {
                const user = await User.findById(userId);
                return user;
            }));
        }
        projectTrees.push({
            project: project,
            tree: {
                _id: project.root,
                project: project._id,
                title: project.name,
                users: newMembers,
                children: list_tree_lookup(tree[index].subtasks, tree[index].children)
            },
        });    
    }
    return projectTrees.map((a: any) => {
        return {
            project: a.project.toObject(),
            tree: a.tree
        }
    });
}

export async function getFriends(includeSelf = false) {
    const session = await getServerSession(authOptions);
    await connectDb();
    if (!session || !(session as any).user) return;
    const user = await User.findOne({
        username: (session as any).user.username
    });
    if (!user) return;
    const friends: any[] = [];
    await Promise.all(user.friends.map(async (friendId: any) => {
        const friend = await User.findById(friendId);
        friends.push(friend);
    }));
    if (includeSelf) {
        friends.push(user);
    }
    return friends.map((a: any) => {
        if (a) {
            return a.toObject();
        }
        return {};
    });
}

export async function addFriend(username: String) {
    const session = await getServerSession(authOptions);
    await connectDb();
    if (!(session as any).user) return;
    const user = await User.findOne({
        username: (session as any).user.username
    });
    const friend = await User.findOne({
        username: username
    });
    if (!friend) return;
    await User.findByIdAndUpdate(user._id, {
        friends: [...user.friends, friend._id]
    });
    await User.findByIdAndUpdate(friend._id, {
        friends: [...friend.friends, user._id]
    });
    return friend.toObject();
}

export async function removeFriend(username: String) {
    console.log("removeFriend", username);
    const session = await getServerSession(authOptions);
    await connectDb();
    if (!(session as any).user) return;
    const user = await User.findOne({
        username: (session as any).user.username
    });
    const friend = await User.findOne({
        username: username
    });
    if (!friend) return;
    await User.findByIdAndUpdate(user._id, {
        friends: user.friends.filter((a: any) => a.toString() != friend._id.toString())
    });
    await User.findByIdAndUpdate(friend._id, {
        friends: friend.friends.filter((a: any) => a.toString() != user._id.toString())
    });
    return friend.toObject();
}