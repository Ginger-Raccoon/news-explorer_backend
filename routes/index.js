const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().trim().min(5).required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().pattern(/[a-z0-9]+([\w]+\.)*([\w]+-)*([\w])*([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+|([a-z0-9]@)[\w-]+(\.[\w-]+)*\.[a-z]+/),
    password: Joi.string().trim().min(5).required(),
    name: Joi.string().min(2).max(30).required(),
  }),
}), createUser);

router.use(auth);
router.use('/articles', require('./articles'));
router.use('/users', require('./users'));

module.exports = router;
