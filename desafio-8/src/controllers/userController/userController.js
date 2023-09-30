const passport = require('passport');

class ProductsController {
    async register(req, res) {
        try {
            if (!req.user) return res.status(401).send({ message: 'Invalid User' });

            const token = req.user.token;
            res.cookie('coderToken', token, { maxAge: 3600000, httpOnly: true });
            res.send({ status: "OK", message: 'usuario registrado' });

        } catch (error) {
            res.status(500).json({ error: 'Error al registrarse!' });
        }
    }

    async login(req, res) {
        try {
            if (!req.user) return res.status(401).send({ message: 'Invalid User' });

            const token = req.user.token;
            res.cookie('coderToken', token, { maxAge: 3600000, httpOnly: true });
            res.send({ status: 200, message: 'usuario registrado' });
        } catch (error) {
            res.status(404).json({ error: 'El usuario ingresado no existe' })
        }
    }

    async githubCallBack(req, res) {
        req.session.user = req.user;
        req.session.loggedIn = true;
        res.redirect("/products");
    }

    async authenticateRegister(req, res, next) {
        passport.authenticate("register", { failureRedirect: "/failregister" })(req, res, next);
    }

    async authenticateLogin(req, res, next) {
        passport.authenticate("login", { failureRedirect: "/faillogin" })(req, res, next);
    }

    githubAuthenticate(req, res, next) {
        passport.authenticate("github", { scope: ["user:email"] })(req, res, next);
    }

    githubCallbackAuthenticate(req, res, next) {
        passport.authenticate("github", { failureRedirect: "/login" })(req, res, next);
    }

    current(req, res) {
        try {
            if (req.isAuthenticated()) {
                const user = req.user;
                res.json({ user });
            } else {
                res.status(401).json({ message: 'Usuario no autenticado' });
            }
        } catch (error) {
            res.status(404).json({ error: 'El usuario no se encuentra autenticado' })
        }
    }

    logout(req, res) {
        try{
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error al cerrar sesión:', err);
                }
    
                res.redirect('/');
            });
        }catch(error){
            res.status(500).json({ error: 'La sesion no ha podido destruirse' })
        }
        
    }
}

module.exports = new ProductsController();






