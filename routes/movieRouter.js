const movieRouter = require('express').Router();
const { getMovies, addMovie, deleteMovie } = require('../controllers/movies');
const { validateMovieId, validateNewMovie } = require('../utils/validationConfig');

movieRouter.get('/', getMovies);
movieRouter.post('/', validateNewMovie, addMovie);
movieRouter.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = movieRouter;
