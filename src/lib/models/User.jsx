/*
    The User schema represents the user's data structure inside the database
 */
import mongoose from "mongoose"
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email address',
            },
            unique: true,
            max: 50,
        },
        username : {
            type: String,
            required: false,
            unique: true,
            min: 6,
            max: 20,
        },
        password: {
            type: String,
            required: false,
            min: 6
        },
        picture: {
            type: String,
            required: false
        }
    }, {timestamps: true} );
export default (mongoose.models && (mongoose.models.User)) || mongoose.model("User", userSchema);