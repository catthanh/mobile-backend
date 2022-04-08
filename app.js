const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");
const { verifyAccessToken } = require("./helpers/jwt_helper");

const AuthRoute = require("./routes/auth.route");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 3000;

app.get("/", verifyAccessToken, async (req, res, next) => {
    res.send("Hello World");
});

app.use("/auth", AuthRoute);

app.use(async (req, res, next) => {
    next(createError.NotFound());
});

app.use(async (error, req, res, next) => {
    res.status(error.status || 500);
    res.send({
        error: {
            status: error.status || 500,
            message: error.message || "Internal Server Error",
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
