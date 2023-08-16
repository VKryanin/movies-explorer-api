const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;

const Movie = require('../models/movie');
const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { DeletionError } = require('../utils/errors/DeletionError');

const addMovie = (req, res, next) => {
  Movie.create({ owner: req.user._id, ...req.body })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new NotFoundError('Такой фильм не найден'))
    .then((foundMovie) => {
      if (!foundMovie.owner.equals(req.user._id)) return next(new DeletionError('Недостаточно прав'));
      return Movie.deleteOne(foundMovie)
        .then(() => res.send({ message: `Фильм "${foundMovie.nameRU}" успешно удалён.` }));
    })
    .catch(next);
};

module.exports = {
  addMovie,
  getMovies,
  deleteMovie,
};
