require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose'); // импорт монгус
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const limiter = require('./middlewares/rateLimit');

const { requestLogger, errorLogger } = require('./middlewares/logger');
const router = require('./routes/index');

const { NODE_ENV, BASE_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? BASE_URL : 'mongodb://localhost:27017/diploma', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const { PORT = 3000 } = process.env;

const app = express();

const NotFoundError = require('./errors/not-found-err');

app.use(cookieParser());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use('*', () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

app.use('/', errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
