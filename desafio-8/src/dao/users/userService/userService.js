const userModel = require('../../models/user.model');

class UserManager {
    constructor() {
        this.userLogged = null; 
    }

    async addUser(user) {
        try {
            const existingUser = await userModel.findOne({ email: user.email });

            if (existingUser) {
                console.log('El usuario ya existe.');
                return false; 
            }

            await userModel.create(user);
            console.log('Usuario registrado con éxito.');

            return true; 
        } catch (error) {
            console.log(error);
            return false; 
        }
    }

    async login(username, password) {
        try {
            this.userLogged =  await userModel.findOne({ email: username, password: password }) || null;
    
            if (this.userLogged) {
                console.log('user logged!');
    
                if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                    this.userLogged.role = 'admin'; 
                } else {
                    this.userLogged.role = 'user'; 
                }

                await this.userLogged.save();

                return this.userLogged;
            }
    
            return null; 
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

const userManager = new UserManager();

module.exports = userManager;
