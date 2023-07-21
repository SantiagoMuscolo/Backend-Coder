const express = require("express");
const app = express();
const productManager = require('./productManager');

const PORT = 3000;

app.get('/products', async(req, res) => {
    try {
        const limit = req.query.limit;
        await productManager.getProducts()
            .then((products) => {
                let response = products;

                if (limit) {
                    const parsedLimit = parseInt(limit, 10);

                    if (!isNaN(parsedLimit)) {
                        response = products.slice(0, parsedLimit);
                    }
                }
                res.json(response);
            })
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
})

app.get('/products/:pid', async (req, res) => {
    try{
        const productId = parseInt(req.params.pid);
        await productManager.getProductById(productId)
            .then((product) => {
                if (product) {
                    res.json(product);
                } else {
                    res.status(404).json({ error: 'Producto no encontrado' });
                }
            })
    }catch(error){
            res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));