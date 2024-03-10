import mongoose from "mongoose";

/*
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to MongoDB.");
    } catch(error) {
        console.log(error);
    }
}

export default connectMongoDB;
*/


const connectMongoDB = async () => {
    try {
        if (!mongoose.connections[0].readyState) {
            await mongoose.connect(process.env.MONGODB_URI);
        }
    } catch (error) {
        throw new Error(error);
    }
}

export default connectMongoDB;