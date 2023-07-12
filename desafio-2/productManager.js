const fs = require('fs')


class productManager {
    constructor() {
        this.path = 'Products.json';
        this.requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    }

    existFile() {
        return fs.existsSync(this.path);
    }


    async readFile() {
        try {
            const file = fs.readFileSync(this.path, 'utf-8');
            return JSON.parse(file) || [];
        } catch (error) {
            throw new Error(`[ERROR] -> ${error}`);
        }
    }

    validateId(arr) {
        if (arr.length) {
            let idMayor = arr.reduce((prev, current) => {
                return current.id > prev ? current.id : prev
            }, 0)
            return idMayor + 1;
        } else {
            return 1;
        }
    }

    async addProduct(obj) {
        try {
            const missingFields = this.requiredFields.filter(field => !(field in obj));
            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
            }

            let file = [];
            const existFile = await this.existFile();
            if (existFile) {
                file = await this.readFile(this.path);
            }

            const id = this.validateId(file);
            const productWithid = { id, ...obj };

            file.push(productWithid);

            let text = JSON.stringify(file, null, 2);
            await fs.promises.writeFile(this.path, text);
        } catch (error) {
            throw new Error(`[ERROR] -> ${error}`);
        }
    }

    async getProducts() {
        try {
            let file = await this.readFile(this.path);
            return file;
        } catch (error) {
            throw new Error(`[ERROR] -> ${error}`);
        }
    }

    async getProductById(id) {
        try {
            let file = await this.readFile(this.path);
            const product = file.find(product => product.id === id);

            if (!product) {
                throw new Error('Product not found')
            }

            return product;
        } catch (error) {
            console.log(`[ERROR] -> ${error}`);
            return null;
        }
    }

    async updateProduct(id, field, newField) {
        try {
            let file = await this.readFile(this.path);
            const productToUpdate = file.find(product => product.id === id);

            if (!productToUpdate) {
                return console.log('product not found');
            }

            productToUpdate[field] = newField;
            let text = JSON.stringify(file, null, 2);
            await fs.promises.writeFile(this.path, text)
        } catch (error) {
            throw new Error(`[ERROR] -> ${error}`);
        }
    }

    async deleteProduct(id) {
        try {
            let file = await this.readFile(this.path);
            const index = file.findIndex(product => product.id === id);

            if (index === -1) {
                return console.log('product not found');
            }

            file.splice(index, 1)
            let text = JSON.stringify(file, null, 2);
            await fs.promises.writeFile(this.path, text);
        } catch (error) {
            throw new Error(`[ERROR] -> ${error}`);
        }
    }
}


async function main() {
    let product = new productManager();

    await product.addProduct({
        title: 'pen',
        description: 'this is a pen',
        price: 200,
        thumbnail: 'imagen.jpg',
        code: 1800,
        stock: 5
    });

    await product.addProduct({
        title: 'pencil',
        description: 'this is a pencil',
        price: 200,
        thumbnail: 'imagen.jpg',
        code: 1850,
        stock: 5
    });

    await product.addProduct({
        title: 'stencil',
        description: 'this is a stencil',
        price: 200,
        thumbnail: 'imagen.jpg',
        code: 1500,
        stock: 5
    });

    console.log(await product.getProducts());
    await product.getProductById(3);
    await product.deleteProduct(1);
    await product.updateProduct(1, "title", "console");
}

main().catch(error => {
    console.log(error);
})

module.exports = productManager;