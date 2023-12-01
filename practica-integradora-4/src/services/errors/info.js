const generateUserErrorInfo = (user) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * first_name: needs to be a string, recieved ${user.first_name}
    * last: needs to be a string, recieved ${user.last_name}
    * email: needs to be a string, recieved ${user.email}
    `
}

const generateProductErrorInfo = (product) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * thumbnails: needs to be a string, recieved ${product.thumbnails}
    * title: needs to be a string, recieved ${product.title}
    * description: needs to be a string, recieved ${product.description}
    * price: needs to be a number, recieved ${product.price}
    * code: needs to be a string, recieved ${product.code}
    * stock: needs to be a number, recieved ${product.stock}
    `
}

const generateParamErrorInfo = (param) => {
    return `The param is not valid ${param}`
}

module.exports = {
    generateProductErrorInfo, 
    generateUserErrorInfo,
    generateParamErrorInfo
}
