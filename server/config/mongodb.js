import mongoose from "mongoose";

const connectDB = async ()=>{

    mongoose.connection.on('connected',()=>console.log("Database Connected"));

    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)//.mern-auth is a db name, if it doesnot exist it will create new one

}


export default connectDB;