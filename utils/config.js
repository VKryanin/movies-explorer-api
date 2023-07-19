const rateLimit = require('express-rate-limit');

const isProduction = process.env.NODE_ENV === 'production';
const security = isProduction ? process.env.JWT_SECRET : 'dev';
const PORT = process.env.PORT || 3000;

const MONGO = process.env.MONGO_DB || 'mongodb://127.0.0.1:27017/bitfilmsdb';
const MONGO_OPTIONS = {
  useNewUrlParser: true,
};

const LIMITER = rateLimit({
  windowMs: 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  security, MONGO, MONGO_OPTIONS, PORT, LIMITER,
};
