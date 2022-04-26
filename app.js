const morgan = require("morgan");
const express = require("express");
const createError = require("http-errors");
const AuthRoute = require("./routes/auth.route");
const RestaurantRoute = require("./routes/Restaurant.route");
const { verifyAccessToken } = require("./helpers/jwt_helper");
require("dotenv").config();
//require("./helpers/init_mongodb");
const db = require("./models");
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
    res.send("Hello World");
});
app.use("/auth", AuthRoute);
app.use("/restaurant", verifyAccessToken, RestaurantRoute);
app.use(async (req, res, next) => {
    next(createError.NotFound());
});
app.use(async (err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message || "Internal server error",
        },
    });
});

const PORT = process.env.PORT || 3000;
db.sequelize.sync({ alter: false }).then((req) => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });
