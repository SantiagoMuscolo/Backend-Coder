const ProductRepository = require('../../dao/products/productRepository/productRepository');
const productRepository = new ProductRepository();
const CustomError = require('../../services/errors/CustomError');
const EErrors = require('../../services/errors/enums');
const { generateParamErrorInfo, generateProductErrorInfo } = require('../../services/errors/info');

const requiredFields = ['title', 'description', 'price', 'code', 'stock'];

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
    const productId = parseInt(req.params.pid);
    try {
      if (!productId || isNaN(productId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(productId),
          message: `The param ${productId} must be a number`,
          code: EErrors.INVALID_PARAM
        });
      }
      const product = await productRepository.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ code: EErrors.INVALID_PARAM, cause: generateParamErrorInfo(productId), error: error.message });
    }
  }

  async addProduct(req, res) {
    let productData = req.body;
    const owner = req.user.email;
    try {
      for (const field of requiredFields) {
        if (!productData.hasOwnProperty(field)) {
          CustomError.createError({
            name: "Product creation error",
            cause: generateProductErrorInfo(productData),
            message: `Missing or invalid field: ${field}`,
            code: EErrors.INVALID_TYPES_ERROR
          });
        }
      }
      const newProduct = await productRepository.addProduct({ productData, owner });
      if (newProduct == 'Producto invalido!') {
        res.status(400).json({ error: 'Producto invalido' });
      } else {
        res.status(201).json(newProduct);
      }
    } catch (error) {
      res.status(500).json({ code: EErrors.INVALID_TYPES_ERROR, cause: generateProductErrorInfo(productData), error: error.message });
    }
  }

  async updateProduct(req, res) {
    const productId = parseInt(req.params.pid);
    const product = req.body;
    try {
      if (!productId || isNaN(productId)) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(productId),
          message: `The param ${productId} must be a number`,
          code: EErrors.INVALID_PARAM
        });
      }
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
      res.status(500).json({ code: EErrors.INVALID_PARAM, cause: generateParamErrorInfo(productId), error: error.message });
    }
  }

  async deleteProduct(req, res) {
    const productId = req.params.pid;
    const owner = req.user.email;
    try {
      if (!productId) {
        CustomError.createError({
          name: "Product update error",
          cause: generateParamErrorInfo(productId),
          message: `The param ${productId} must be a number`,
          code: EErrors.INVALID_PARAM
        });
      }
      const existingProduct = await productRepository.getProductById(productId);
      if (!existingProduct) return res.status(404).json({ error: 'Producto no encontrado' });
      if (existingProduct[0].owner === owner) {
        await productRepository.deleteProduct(productId);
        res.status(204).end();
      } else {
        res.status(403).json({ error: 'No tienes permisos para borrar este producto.' });
      }
    } catch (error) {
      res.status(500).json({ code: EErrors.INVALID_PARAM, cause: generateParamErrorInfo(productId), error: error.message });
    }
  }
}

module.exports = new ProductsController();
