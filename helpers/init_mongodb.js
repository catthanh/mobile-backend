const mongoose = require("mongoose");

mongoose
    .connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err.message));

mongoose.connection.on("connected", () => {
    console.log("Mongoose onnected to DB");
});

mongoose.connection.on("error", (err) => {
    console.log(err.message);
});

mongoose.connection.on("disconnected", () => {
    console.log("Disconnected from DB");
});

process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("Mongoose disconnected through app termination");
    process.exit(0);
});
