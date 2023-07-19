const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: 'Email is incorrect',
      },
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.statics.findUserByCredentials = function checkPasswordOnLogin(email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) return Promise.reject(new UnauthorizedError('Неправильная почта или пароль'));
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) return Promise.reject(new UnauthorizedError('Неправильная почта или пароль'));
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
