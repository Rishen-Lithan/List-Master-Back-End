import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log('Database connected');
        
    } catch (error) {
        console.error('Error connecting database : ', error);
    }
}

export default connectDB;