const userRouter = require('express').Router();
const { getUser, updateUser } = require('../controllers/user');
const { validateUpdatedUserData } = require('../utils/validationConfig');

userRouter.get('/me', getUser);
userRouter.patch('/me', validateUpdatedUserData, updateUser);

module.exports = userRouter;
