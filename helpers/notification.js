const FcmToken = require("../models").FcmToken;
const firebase = require("firebase-admin");

const getUserFcmToken = async (userId) => {
  const results = await FcmToken.findOne({
      where: {idUser: userId},
      raw: true
  })

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

    getNotiMultipleDevice: (notiData, userIds) => {
      const firebaseTokens = getMultiUserFcmToken(userIds);

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

    getNotiTopic: (notiData, topic) => {
      const notificationData = {
        message: {
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
    }
}