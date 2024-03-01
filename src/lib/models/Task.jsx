/*
    The Task schema represents the task's data structure inside the database
 */
    import mongoose from "mongoose"
    const taskSchema = new mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: false,
            },
            status: {
                type: String,
                required: true,
                enum: ["todo", "in progress", "completed", "backlog"],
                default: "todo"
            },
            users: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "User",
                required: true
            },
            project: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Project",
                required: false
            },
            subtasks: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "Task",
                required: false
            },
            parent: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
                required: false
            },
            dueDate: {
                type: Date,
                required: false
            },
            priority: {
                type: Number,
                required: true,
                min: 1,
                max: 5,
                default: 3
            }
        }, {timestamps: true} );
    export default mongoose.models.Task || mongoose.model("Task", taskSchema);