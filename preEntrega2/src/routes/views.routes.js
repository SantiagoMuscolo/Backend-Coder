const express = require('express');
const exphbs = require('express-handlebars');
const PM = require('../dao/products/productsService/productManager');

module.exports = (app) => {
        app.set('views', './src/views');
        app.use(express.static('public'));

        app.engine('handlebars', exphbs.engine());
        app.set('view engine', 'handlebars');

        app.get('/', async (req, res) => {
            const products = await PM.getProducts()
            console.log(products)
            res.render('home', { products })
        });
}