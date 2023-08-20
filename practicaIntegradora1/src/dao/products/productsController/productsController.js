const productManager = require('../productsService/productManager');

class ProductsController {
    async getProducts(req, res) {
        try {
            const limit = req.query.limit;
            const products = await productManager.getProducts();

            let response = products;

            if (limit) {
                const parsedLimit = parseInt(limit, 10);

                if (!isNaN(parsedLimit)) {
                    response = products.slice(0, parsedLimit);
                }
            }

            res.json(response);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = parseInt(req.params.pid);
            const product = await productManager.getProductById(productId);

            if (product) {
                res.json(product);
            } else {
                res.status(404).json({ error: 'Producto no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }

    async addProduct(req, res) {
        try {
            const productData = req.body;

            const newProduct = await productManager.addProduct(productData);
            if (newProduct == 'Producto invalido!') {
                res.status(400).json({ error: 'Producto invalido' });
            } else {
                res.status(201).json(newProduct);
            }
        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = parseInt(req.params.pid);
            const product = req.body;

            if (Object.keys(product).length === 0) {
                return res.status(400).json({ error: 'Se debe enviar al menos un campo para actualizar' });
            }

            const existingProduct = await productManager.getProductById(productId);
            if (!existingProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            const updatedIt = await productManager.updateProduct(productId, product);

            res.json(updatedIt)

        } catch (error) {
            res.status(500).json({ error: 'Error al actualizar el producto' });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = parseInt(req.params.pid);

            const existingProduct = await productManager.getProductById(productId);
            if (!existingProduct) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            await productManager.deleteProduct(productId);

            res.status(204).end();
        } catch (error) {
            res.status(500).json({ error: 'Error al eliminar el producto' });
        }
    }
}

module.exports = new ProductsController();






