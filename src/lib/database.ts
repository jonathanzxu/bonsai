/*
    Connect to the database
    Ensure MONGO is set in .env
 */
import mongoose from "mongoose";

const connectDb = async () => {
    try {
        if (!mongoose.connections[0].readyState && process.env.MONGO) {
            await mongoose.connect(process.env.MONGO);
        }
    } catch (error) {
        throw new Error(error as any);
    }
}

export default connectDb;
