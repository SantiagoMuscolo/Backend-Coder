const productModel = require('../../models/product.model')

class ProductManager {
    static id = 0;

    constructor() {
        this.products = [];
    }

    getProducts() {
        try {
            return productModel.find().lean()
        } catch (error) {
            console.log(error);
        }
    }
    
    async getProductById(id) {
        try {
            return productModel.find({id: id}).lean()
        } catch (error) {
            console.log(error);
        }
    }

    async isValidateCode(code) {
        const products = await productModel.find({ code });
        return products.length > 0;
    }

    async addProduct(product) {
        try {
                if (await this.isValidateCode(product.code)) {
                    return 'Este producto ya existe!';
                }else{
                    const id = ++ProductManager.id
                    const newProduct = {
                        id,
                        status: true,
                        thumbnails: [],
                        ...product
                    };
        
                    productModel.create(newProduct)
                }
        } catch (error) {
            console.log(error);
        }
    }


    async updateProduct(id, product) {
        try {
            return productModel.updateOne({id: id}, product)
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        try {
            return productModel.deleteOne({id: id})
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

const productManager = new ProductManager();

module.exports = productManager;
