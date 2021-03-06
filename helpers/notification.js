const FcmToken = require("../models").FcmToken;
const firebase = require("firebase-admin");

const getUserFcmToken = async (userId) => {
  const results = await FcmToken.findOne({
      where: {idUser: userId},
      raw: true
  })
  console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa: ", userId);
  return results.token;
}

const getMultiUserFcmToken = async (userIds) => {
  const results = await FcmToken.findAll({
      where: {
        idUser: userIds
      },
  })

  return results;
}
const sendToFirebase = async (notificationData) => {
  try {
    response = await firebase.messaging().send(notificationData.message);
    console.log(response);
    notificationData.sent = true;
  } catch (error) {
    console.log(error);
    notificationData.error = error.message;
  }
  console.log("Notification data: ", notificationData);
}
module.exports = {
    getNotiSpecificDevice: async (notiData, userId) => {
        const firebaseToken = await getUserFcmToken(userId);
        console.log(firebaseToken);

        // Create title and body
        const body = notiData.body;
        const title = notiData.title;
      
        let notificationData = {
          message: {
            notification: {
              title: title, // title of notification 
              body: body, // describe of notification
            },
            data: notiData.data, // payload data
            token: firebaseToken, // registration token
          },
      
          // Meta Data for logging (store in database)
          userId: userId, // User info
          sent: false, // Notification status
          error: null, // Errors if present
          date: new Date(),
        };
      
        return notificationData;
    },

    getNotiMultipleDevice: async (notiData, userIds) => {
      const firebaseTokens = await getMultiUserFcmToken(userIds);

      // Create title and body
      const body = notiData.body;
      const title = notiData.title;
    
      let notificationData = {
        message: {
          notification: {
            title: title, // title of notification 
            body: body, // describe of notification
          },
          data: notiData.data, // payload data
          tokens: firebaseTokens, // registration token
        },
    
        // Meta Data for logging (store in database)
        userIds: userIds, // User info
        sent: false, // Notification status
        error: null, // Errors if present
        date: new Date(),
      };
    
      return notificationData;
    },

    getNotiTopic: async (notiData, topic) => {
      const notificationData = {
        message: {
          notification: {
            title: "test", // title of notification 
            body: "backend dep zai", // describe of notification
          },
          data: notiData.data, // payload data
          topic: topic // topic that we push message to
        },
    
        // Meta Data for logging (store in database)
        sent: false, // Notification status
        error: null, // Errors if present
        date: new Date(),
      };
    
      return notificationData;
    },

    setSubscribeToTopic: async (topic, userId) => {
      const regisTokens = await getUserFcmToken(userId);

      await firebase.messaging().subscribeToTopic(regisTokens, topic)
        .then((response) => {
          // See the MessagingTopicManagementResponse reference documentation
          // for the contents of response.
          console.log('Successfully subscribed to topic:', response);
        })
        .catch((error) => {
          console.log('Error subscribing to topic:', error);
        });
    },

    sendToUser: async (message, userId) => {
      const firebaseToken = await getUserFcmToken(userId);

      // Create title and body
      const body = message?.body || "B???n c?? th??ng b??o m???i";
      const title = message?.title || "Eat247";
    
      let notificationData = {  
        message: {
          notification: {
            title: title, // title of notification 
            body: body, // describe of notification
          },
          data: message.data, // payload data
          token: firebaseToken, // registration token
        },
    
        // Meta Data for logging (store in database)
        userId: userId, // User info
        sent: false, // Notification status
        error: null, // Errors if present
        date: new Date(),
      };
      //send notification
      await sendToFirebase(notificationData);
      return;
    },
    sendToMultiUser: async (message, userIds) => {
      const firebaseTokens = await getMultiUserFcmToken(userIds);

      // Create title and body
      const body = message?.body || "B???n c?? th??ng b??o m???i";
      const title = message?.title || "Eat247";
    
      let notificationData = {
        message: {
          notification: {
            title: title, // title of notification 
            body: body, // describe of notification
          },
          data: message.data, // payload data
          tokens: firebaseTokens, // registration token
        },
    
        // Meta Data for logging (store in database)
        userId: userIds, // User info
        sent: false, // Notification status
        error: null, // Errors if present
        date: new Date(),
      };
      //send notification
      await sendToFirebase(notificationData);
      return;
    },
    sendToTopic: async (message, topic) => {
      // Create title and body
      const body = message?.body || "B???n c?? th??ng b??o m???i";
      const title = message?.title || "Eat247";
    
      let notificationData = {
        message: {
          notification: {
            title: title, // title of notification 
            body: body, // describe of notification
          },
          data: message.data, // payload data
          topic: topic || "shipperOrder", // registration topic
        },
    
        // Meta Data for logging (store in database)
        topic: topic, // User info
        sent: false, // Notification status
        error: null, // Errors if present
        date: new Date(),
      };
      //send notification
      await sendToFirebase(notificationData);
      
      return;
    },
}