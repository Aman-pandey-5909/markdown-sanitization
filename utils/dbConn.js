const mongoose = require("mongoose");

const connectDB = async () => {
    try {

        const connection = mongoose.connection;
        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

        connection.on("error", (err) => {
            console.log("MongoDB connection error", err);
            process.exit();
        });

        connection.on("disconnected", () => {
            console.log("MongoDB disconnected");
        });

        await mongoose.connect(process.env.MONGO_URI);
        

    } catch (error) {
        console.log('error in connection: ', error);
    }
};

module.exports = connectDB;