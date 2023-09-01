const userManager = require('../userService/userService');


class ProductsController {
    async register(req, res) {
        try {
            const userData = req.body;

            const userRegistered = await userManager.addUser(userData);

            if (userRegistered) {
                res.send({ status: "OK", message: userRegistered });
            } else {
                res.status(401).send({ status: "Error", message: "No se pudo registrar el Usuario!" });
            }

        } catch (error) {
            res.status(500).json({ error: 'Error al agregar el producto' });
        }
    }

    async login(req, res) {
        let { user, pass } = req.query;

        const userLogged = await userManager.login(user, pass);

        if (userLogged) {
            res.send({ status: 'OK', message: userLogged })
        } else {
            res.status(401).send({ status: 'Error', message: 'No se pudo loguear el Usuario!' })
        }
    }

}

module.exports = new ProductsController();






