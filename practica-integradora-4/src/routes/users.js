const { Router } = require('express');
const userController = require('../controllers/userController/userController');
const bodyParser = require("body-parser");
const passport = require('passport');
const  upload  = require('../middlewares/Multer.js')
const cookieParser = require('cookie-parser');
require('dotenv').config()

module.exports = app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());

  let router = new Router();

  app.use('/api/users', router);

  router.post('/:uid/documents', upload.fields([{ name: 'profiles' }, { name: 'products' }, { name: 'documents' }]), userController.uploadDocuments);
  router.get('/:uid', userController.getUserById);
  router.get('/premium/:uid', userController.getUserPremium)
}