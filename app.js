require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');

const { requestLogger, errorLogger } = require('./midlwares/logger');
const responseUndefined = require('./midlwares/responseUndefined');
const router = require('./routes');
const {
  MONGO,
  MONGO_OPTIONS,
  PORT,
  LIMITER,
} = require('./utils/config');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);
mongoose.connect(MONGO, MONGO_OPTIONS);

app.use(LIMITER);
app.use(helmet());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(responseUndefined);
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('Сервер слушает порт:', PORT));
