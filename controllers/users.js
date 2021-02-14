const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getUser = (req, res, next) => {
  const owner = req.user._id;
  User
    .findById(owner)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        res.send({
          name: user.name,
          email: user.email,
        });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Нет пользователя с таким id');
      } else {
        return next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  if (!password) {
    throw new BadRequestError('Введите пароль');
  }
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => res.send({
      name, email,
    }))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  if (!password) {
    throw new BadRequestError('Введите пароль');
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const { NODE_ENV, JWT_SECRET } = process.env;
      const token = jwt.sign({ _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: false,
        });
      console.log('авторизация прошла успешно');
      return res.send({ token });
    })
    .catch(next);
};

module.exports.unlogin = (req, res, next) => {
  const owner = req.user._id;
  User
    .findById(owner)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        const { NODE_ENV, JWT_SECRET } = process.env;
        const token = jwt.sign({ _id: user._id },
          NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
          { expiresIn: '7d' });
        res
          .cookie('jwt', token, {
            maxAge: 0,
            httpOnly: true,
            sameSite: true,
          });
        console.log('выход прошел успешно');
        return res.send({ token });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequestError('Нет пользователя с таким id');
      } else {
        return next(err);
      }
    });
};
