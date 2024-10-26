import mongoose, { ConnectOptions } from "mongoose";
const MONGO_URL = process.env.MONGO_URL || "";
const options: ConnectOptions = {
  //  options connect mongodb
};

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, options);
    console.log("Success connect to MongoDB. url: " + MONGO_URL);
  } catch (error) {
    console.log(`failed connect to MongoDB. url: ${MONGO_URL}`);
  }
};
connectToMongoDB();
export default connectToMongoDB;
