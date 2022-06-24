const firebase = require("firebase-admin");

module.exports = {
    notifyHandler: async (req, res, next) => {
        /* 
          Check whether the data is present, 
          if not call next()
          */
        if (!req.notificationData) next();
        let notificationData = req.notificationData;
      
        try {
          response = await firebase.messaging().send(req.notificationData.message);
          notificationData.sent = true;
        } catch (error) {
          console.log(error);
          notificationData.error = error.message;
        }
        
        console.log("Notification data: ", notificationData);
        return;
      }
}

// -------------- Sample for middleware ------------------------

// const { getNotificationData } = require("../helpers/notification");
// exports.addResource = async (req, res, next) => {
//   res.status(200).send("<Your response data>");

//   req.notificationData = getNotificationData(data, firebaseToken);

//   next();
// };

// ----------------- Sample in route --------------

// const express = require("express");
// const notifyHandler = require("../controllers/Firebase.controller").notifyHandler;
// const resource = require("../controllers/resource");
// const router = express.Router();

// router.post("/resource", resource.addResource, notifyHandler);

// module.exports = router;
