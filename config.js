
import mongoose from "mongoose";

const url = "mongodb://127.0.0.1:27017/chatApp";

export const connect = async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log("Mongodb connected");

}
