const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const TokenWrong = (res, req, next) => {
  next(new UnauthorizedError('Ошибка при авторизации'));
};

module.exports = function auth(req, res, next) {
  const { authorization } = req.headers;
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) return TokenWrong(res, req, next);

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return TokenWrong(res, req, next);
    
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev');
  } catch (err) {
    return TokenWrong(res, req, next);
  }

  req.user = payload;

  next();
};

