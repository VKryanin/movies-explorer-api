const { celebrate, Joi } = require('celebrate');

const REGEX_URL = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-._~:/?#[\]@!$&amp;'()*+,;=]+(\.[a-z]{2,3})+(\/?)+#?$/;

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().min(7).required().email(),
    password: Joi.string().required(),
  }),
});

const validateRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validatePatchUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().min(2).max(30).required(),
  }),
});

const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().length(4).required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(REGEX_URL),
    trailerLink: Joi.string().required().pattern(REGEX_URL),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(REGEX_URL),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateLogin,
  validateRegister,
  validatePatchUser,
  validateMovieId,
  validateNewMovie,
};
