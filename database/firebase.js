const firebase = require("firebase-admin");

const serviceAccount = require("../config/mobile-shoppeefood-firebase-adminsdk.json");
const dbUrl = "https://<Your DB>.firebaseio.com"; 

module.exports = () => {
  firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    // databaseURL: dbUrl,
  });
  console.info("Initialized Firebase SDK");
};