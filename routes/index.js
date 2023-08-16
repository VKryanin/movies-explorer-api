const router = require('express').Router();
const { addUser, login } = require('../controllers/user');
const auth = require('../midlwares/auth');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { validateLogin, validateRegister } = require('../utils/validationConfig');

router.use('/users', auth, require('./userRouter'));
router.use('/movies', auth, require('./movieRouter'));

router.use('/signin', validateLogin, login);
router.use('/signup', validateRegister, addUser);

router.use('*', auth, (req, res, next) => next(new NotFoundError('Упс. Такой страницы нет')));

module.exports = router;
