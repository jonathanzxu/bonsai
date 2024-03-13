/*
    The Project schema represents the project's data structure inside the database
 */
    import mongoose from "mongoose"
    const projectSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: true,
                unique: true
            },
            description: {
                type: String,
                required: false
            },
            members: {
                type: [mongoose.Schema.Types.ObjectId],
                ref: "User",
                required: true
            },
            root: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
                required: true
            }
        }, {timestamps: true} );
    export default mongoose.models.Project || mongoose.model("Project", projectSchema);