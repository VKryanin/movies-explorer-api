const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { security } = require('../utils/config');

const User = require('../models/user');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
const { EmailIsBusyError } = require('../utils/errors/EmailIsBusyError');

const addUser = (req, res, next) => {
  const { email, password, name } = req.body;

  return bcryptjs.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    .then(() => res.status(201).send({ email, name }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else if (err.code === 11000) {
        next(new EmailIsBusyError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, security, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('Ошибка логина или пароля'))
    .then((userData) => res.send({ data: userData }))
    .catch((err) => next(err));
};

const updateUser = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Такой пользователь не найден'))
    .then((updatedUserData) => res.send({ data: updatedUserData }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else if (err.code === 11000) {
        next(new EmailIsBusyError('Пользователь с таким email уже зарегистрирован'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  addUser, getUser, login, updateUser,
};
