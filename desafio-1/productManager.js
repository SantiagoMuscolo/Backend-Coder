class productManager{
    constructor(){
        this.products = []
        this.requiredFields = ['title', 'description', 'price', 'thumbnail', 'code', 'stock'];
    }

    validateId(arr){
        if(arr.length){
            let idMayor = arr.reduce((prev, current) => {
                return current.id > prev ? current.id : prev
            }, 0)
            return idMayor + 1;
        }else{
            return 1;
        }
    }

    validateCode(code){
        return this.products.some(product => product.code === code)
    }

    addProduct(obj){
        let keys = Object.keys(obj)

        for(let field of this.requiredFields){
            if(!keys.includes(field)){
                throw new Error (`the field ${field} is obligatory`)
            }
        }
        
        if(this.validateCode(obj.code)){
            throw new Error('The code already exists')
        }

        this.products.push({
            id: this.validateId(this.products),
            ...obj
        })
    }

    getProducts(){
        return this.products
    }

    getProductById(id){
        return id ? this.products.find(product => product.id === id) : console.log('Not found');
    }
}

let product = new productManager();

product.addProduct({
    title: 'pencil',
    description: 'this is a pencil',
    price: 120,
    thumbnail: 'imagen.png',
    code: 1775,
    stock: 2
})

product.addProduct({
    title: 'pen',
    description: 'this is a pen',
    price: 200,
    thumbnail: 'imagen.jpg',
    code: 1800,
    stock: 5
})

console.log(product);