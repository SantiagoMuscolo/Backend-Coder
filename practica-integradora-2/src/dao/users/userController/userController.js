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
        let { username, password } = req.body;

        const userLogged = await userManager.login(username, password);

        if (userLogged) {
            res.send({ status: 'OK', message: userLogged })
        } else {
            res.status(401).send({ status: 'Error', message: 'No se pudo loguear el Usuario!' })
        }
    }
    async githubCallBack(req, res) {
        req.session.user = req.user;
        req.session.loggedIn = true;
        res.redirect("/products");
    }
    
}

module.exports = new ProductsController();






