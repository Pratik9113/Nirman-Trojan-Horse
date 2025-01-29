import mongoose from 'mongoose';  

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://pratikpatil9113:pratik%406878@cluster0.lu5lr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('DB is connected');
    } catch (error) {
        console.error('Error connecting to DB:', error.message);
    }
};

export default connectDB;  
