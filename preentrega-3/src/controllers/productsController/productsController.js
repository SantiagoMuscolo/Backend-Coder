const ProductRepository = require('../../dao/products/productRepository/productRepository');
const productRepository = new ProductRepository();

class ProductsController {
  async getProducts(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const sort = req.query.sort === 'desc' ? -1 : 1;
      const query = req.query.query ? { title: { $regex: req.query.query, $options: 'i' } } : {};

      const skip = (page - 1) * limit;

      const aggregationPipeline = [
        { $match: query },
        { $sort: { price: sort } },
        { $skip: skip },
        { $limit: limit },
      ];

      const [products, totalProducts] = await Promise.all([
        productRepository.aggregateProducts(aggregationPipeline),
        productRepository.countProducts(query),
      ]);

      const totalPages = Math.ceil(totalProducts / limit);
      const hasPrevPage = page > 1;
      const hasNextPage = page < totalPages;
      const prevPage = hasPrevPage ? page - 1 : null;
      const nextPage = hasNextPage ? page + 1 : null;

      const response = {
        status: 'success',
        payload: products,
        totalpages: totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink: hasPrevPage
          ? `${req.baseUrl}?limit=${limit}&page=${prevPage}&sort=${sort}&query=${querystring.stringify(
              query
            )}`
          : null,
        nextLink: hasNextPage
          ? `${req.baseUrl}?limit=${limit}&page=${nextPage}&sort=${sort}&query=${querystring.stringify(
              query
            )}`
          : null,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({ error: `${error}` });
    }
  }

  async getProductById(req, res) {
    try {
      const productId = parseInt(req.params.pid);
      const product = await productRepository.getProductById(productId);

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

      const newProduct = await productRepository.addProduct(productData);
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

      const existingProduct = await productRepository.getProductById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      const updatedProduct = await productRepository.updateProduct(productId, product);

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  }

  async deleteProduct(req, res) {
    try {
      const productId = parseInt(req.params.pid);

      const existingProduct = await productRepository.getProductById(productId);
      if (!existingProduct) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await productRepository.deleteProduct(productId);

      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  }
}

module.exports = new ProductsController();
