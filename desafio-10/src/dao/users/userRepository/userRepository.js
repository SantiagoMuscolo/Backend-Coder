const userModel = require('../../models/user.model');

class UserRepository {
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
      const userLogged = await userModel.findOne({ email: username, password: password }) || null;

      if (userLogged) {
        console.log('Usuario autenticado!');

        if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
          userLogged.role = 'admin';
        } else {
          userLogged.role = 'user';
        }

        await userLogged.save();

        return userLogged;
      }

      return null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

module.exports = UserRepository;
