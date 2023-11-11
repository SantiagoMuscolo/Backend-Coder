const UserRepository = require('../../dao/users/userRepository/userRepository');
const querystring = require('querystring');
const userRepository = new UserRepository();
const passport = require('passport');
const transporter = require('../../config/mailer')
const crypto = require('crypto');

class UserController {
  async register(req, res) {
    try {
      if (!req.user) return res.status(401).send({ message: 'Invalid User' });

      const token = req.user.token;

      res.cookie('coderToken', token);
      res.send({ status: 'OK', message: 'Usuario registrado' });

    } catch (error) {
      res.status(500).json({ error: 'Error al registrarse!' });
    }
  }

  async login(req, res) {
    try {
      if (!req.user) return res.status(401).send({ message: 'Invalid User' });
      const token = req.user.token;
      res.cookie('coderToken', token);
      res.send({ status: 200, message: 'Usuario registrado' });
    } catch (error) {
      res.status(404).json({ error: 'El usuario ingresado no existe' })
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      const resetExpiration = Date.now() + 3600000;

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiration = resetExpiration;

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

      const mailOptions = {
        from: process.env.MAILER_USER,
        to: user.email,
        subject: 'Restablecimiento de Contraseña',
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
              <a href="${resetLink}">${resetLink}</a>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.error('Error al enviar el correo de restablecimiento:', error);
          return res.status(500).json({ error: 'Error al enviar el correo de restablecimiento' });
        }
        res.status(200).json({ message: 'Correo de restablecimiento enviado con éxito' });
      });
    } catch (error) {
      console.error('Error en la solicitud de restablecimiento de contraseña:', error);
      res.status(500).json({ error: 'Error en la solicitud de restablecimiento de contraseña' });
    }
  }

  async githubCallBack(req, res) {
    req.session.user = req.user;
    req.session.loggedIn = true;
    res.redirect('/products');
  }

  async authenticateRegister(req, res, next) {
    passport.authenticate('register', { failureRedirect: '/failregister' })(req, res, next);
  }

  async authenticateLogin(req, res, next) {
    passport.authenticate('login', { failureRedirect: '/faillogin' })(req, res, next);
  }

  githubAuthenticate(req, res, next) {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  }

  githubCallbackAuthenticate(req, res, next) {
    passport.authenticate('github', { failureRedirect: '/login' })(req, res, next);
  }

  current(req, res) {
    try {
      if (req.cookies.coderToken) {
        const userDTO = {
          id: req.user.user.id,
          nombre: req.user.user.nombre,
          correo: req.user.user.correo,
        };

        res.json(userDTO);
      } else {
        res.status(401).json({ message: 'Usuario no autenticado' });
      }
    } catch (error) {
      res.status(404).json({ error: 'El usuario no se encuentra autenticado' })
    }
  }

  logout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error('Error al cerrar sesión:', err);
        }

        res.redirect('/');
      });
    } catch (error) {
      res.status(500).json({ error: 'La sesión no ha podido destruirse' })
    }
  }
}

module.exports = new UserController();
