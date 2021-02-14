function errorHandler(err, req, res, next) {
  let { statusCode = 500, message } = err;
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Запрос неверно сформирован';
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = 'Данные уже существуют';
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Карточка не найдена';
  }

  if (err.name === 'Error') {
    statusCode = 401;
    message = err.message;
  }

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });

  next();
}

module.exports = errorHandler;
