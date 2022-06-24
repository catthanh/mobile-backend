module.exports = {
    getNotificationData: (data, firebaseToken) => {
        // Create title and body
        let body = data.body;
        let title = data.title;
      
        let notificationData = {
          message: {
            notification: {
              title: title,
              body: body,
            },
            token: firebaseToken, // registration token
          },
      
          // Meta Data for logging (store in database)
          userId: data.userId, // User info
          sent: false, // Notification status
          error: null, // Errors if present
          date: new Date(),
        };
      
        return notificationData;
      }
  }