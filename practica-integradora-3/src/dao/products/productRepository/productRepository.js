const productModel = require('../../models/product.model');
const userModel = require('../../models/user.model');

class ProductRepository {
  async getProducts() {
    try {
      return productModel.find().lean();
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(id) {
    try {
      return productModel.find({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }

  async isValidateCode(code) {
    const products = await productModel.find({ code });
    return products.length > 0;
  }

  async addProduct({ productData, owner }) {
    console.log({ productData, owner }, 'valido');
    try {
      if (await this.isValidateCode(productData.code)) {
        return 'Este producto ya existe!';
      }
      const user = await userModel.findOne({ email: owner }); 
      const isPremiumUser = user && user.isPremium;
      const productOwner = isPremiumUser ? owner : 'admin';
      const newProductSave = new productModel({
        status: true,
        thumbnails: [],
        owner: productOwner,
        ...productData,
      });
      await newProductSave.save();
      return newProductSave;
    } catch (error) {
      console.log(error);
    }
  }

  async updateProduct(id, product) {
    try {
      return productModel.updateOne({ _id: id }, product);
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(id) {
    try {
      return productModel.deleteOne({ _id: id });
    } catch (error) {
      console.log(error);
    }
  }

  async aggregateProducts(pipeline) {
    try {
      const aggregatedProducts = await productModel.aggregate(pipeline);
      return aggregatedProducts;
    } catch (error) {
      throw error;
    }
  }

  async countProducts(query) {
    try {
      const count = await productModel.countDocuments(query);
      return count;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ProductRepository;