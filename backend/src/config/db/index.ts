import mongoose, { ConnectOptions } from "mongoose";
const MONGO_URI = process.env.MONGO_URI || "";
const options: ConnectOptions = {
  //  options connect mongodb
  // useNewUrlParser: true,
};

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, options);
    mongoose.set("debug", true);
    console.log("Success connect to MongoDB. url: " + MONGO_URI);
  } catch (error) {
    console.log(`failed connect to MongoDB. url: ${MONGO_URI}`);
  }
};
connectToMongoDB();
export default connectToMongoDB;
