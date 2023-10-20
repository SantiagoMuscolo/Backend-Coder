const viewRoutes = require('./views.routes.js');
const productsApi = require('./products');
const cartsApi = require('./carts');
const usersApi = require('./sessions.js');
const mockApi = require('./mock.js');

module.exports = app => {
    viewRoutes(app);
    productsApi(app);
    cartsApi(app);
    usersApi(app);
    mockApi(app);
}