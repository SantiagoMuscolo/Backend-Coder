const viewRoutes = require('./views.routes.js');
const productsApi = require('./products.js');
const cartsApi = require('./carts.js');
const usersApi = require('./sessions.js');
const usersDataApi = require('./users.js')

module.exports = app => {
    viewRoutes(app);
    productsApi(app);
    cartsApi(app);
    usersApi(app);
    usersDataApi(app)
}