const morgan = require("morgan");
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const createError = require("http-errors");
const initializeFirebaseSDK = require("./database/firebase");

const AuthRoute = require("./routes/auth.route");
const OwnerRoute = require("./routes/owner.route");
const RestaurantRoute = require("./routes/Restaurant.route");
const FoodRoute = require("./routes/Food.route");
const UserRoute = require("./routes/User.route");
const HpRoute = require("./routes/HomePage.route");
const ShipperRoute = require("./routes/Shipper.route");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const { notifyHandler } = require("./controllers/Firebase.controller");
require("dotenv").config();
const db = require("./models");
const app = express();

// initialize firebase -> global scope
initializeFirebaseSDK();

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
app.use("/owner", verifyAccessToken, OwnerRoute);
app.use("/restaurant", verifyAccessToken, RestaurantRoute);
app.use("/food", FoodRoute);
app.use("/user", verifyAccessToken, UserRoute);
app.use("/homepage", verifyAccessToken, HpRoute);
app.use("/shipper", verifyAccessToken, ShipperRoute);
app.all("*", (req, res, next) => {
  next(createError.NotFound("Not found"));
});

app.use((err, req, res, next) => {
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
