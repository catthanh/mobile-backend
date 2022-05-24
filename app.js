const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const createError = require("http-errors");
const AuthRoute = require("./routes/auth.route");
const RestaurantRoute = require("./routes/Restaurant.route");
const { verifyAccessToken } = require("./helpers/jwt_helper");
require("dotenv").config();
const db = require("./models");
const app = express();

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Mobile API Documentation",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
        servers: [
            {
                url: "https://shopee-food-mobile.herokuapp.com/",
                description: "The production API server",
            },
            {
                url: "http://localhost:3000/",
                description: "development",
            },
        ],
    },
    apis: ["./routes/*.route.js"], // files containing annotations as above
};
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
    res.send("Hello World");
});

app.use("/auth", AuthRoute);
app.use("/restaurant",verifyAccessToken, RestaurantRoute);
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
// db.sequelize.sync({ alter: true }).then((req) => {
//     app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//     });
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
