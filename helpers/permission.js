const Restaurant = require('../models').Restaurant

module.exports = {
    restaurantOwner: async (userId, restaurantId) => {
        const restaurant = await Restaurant.findByPk(restaurantId)
        if(!restaurant || restaurant?.idUser != idUser)
            return null
        return restaurant
    }

}