import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionRes = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `Database Connected with DB Host : ${connectionRes.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB connection ERROR: ", error);
    process.exit(1);
  }
};

export default connectDB;
