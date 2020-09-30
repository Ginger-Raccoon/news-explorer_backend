const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    const { NODE_ENV, JWT_SECRET } = process.env;
    payload = jwt.verify(token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }
  req.user = payload;

  next();
};
