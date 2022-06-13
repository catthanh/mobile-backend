const User = require("../models").User;

module.exports = {
    calDistanceByLatLong: (userLocation, targetLocation) => {
        var [userLat, userLong] = userLocation;
        var [targetLat, targetLong] = targetLocation

        userLong =  userLong * Math.PI / 180;
        targetLong = targetLong * Math.PI / 180;
        userLat = userLat * Math.PI / 180;
        targetLat = targetLat * Math.PI / 180;
   
        // Haversine formula
        let dlon = targetLong - userLong;
        let dlat = targetLat - userLat;
        
        let a = Math.pow(Math.sin(dlat / 2), 2)
                 + Math.cos(userLat) * Math.cos(targetLat)
                 * Math.pow(Math.sin(dlon / 2),2);
               
        let c = 2 * Math.asin(Math.sqrt(a));
   
        // Radius of earth in kilometers. Use 3956
        // for miles
        let r = 6371;
   
        // calculate the result
        return parseFloat(c * r);
    },

    getCurrentTime: () => {
        const date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;
        var minutes  = date.getMinutes();
        minutes = (minutes < 10 ? "0" : "") + minutes;

        return `${hour}:${minutes}:00`;
    },

    getShippingTime: (distance, prepareTime) => {
        const re = new RegExp('[0-9]');

        // calculate total time to ship
        var prepareTime = prepareTime ? prepareTime.match(re) : 0;
        prepareTime = prepareTime ? prepareTime?.[0] : 0;
        const totalTime = parseInt(prepareTime) + parseInt(distance) * 2;

        return totalTime;
    },

    getUserCurrentLocation: async (userId) => {
        const user = await User.findOne({
            attributes: ["currentAddress"],
            where: {id: userId},
        })

        return user.dataValues.currentAddress;
    }
};
