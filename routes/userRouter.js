const userRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/user');
const { validatePatchUser } = require('../utils/validationConfig');

userRouter.get('/me', getUser);
userRouter.patch('/me', validatePatchUser, updateUser);

module.exports = userRouter;
