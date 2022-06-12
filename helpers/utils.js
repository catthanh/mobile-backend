
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
};
