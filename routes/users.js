const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUser,
} = require('../controllers/users');

router.get('/me', celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
}), getUser);

module.exports = router;
