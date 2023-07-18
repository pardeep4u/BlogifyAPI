const express = require('express');
const logger = require('../logger/index');
const { postSignUp, postLogin } = require('../controller/authController');
const {
	checkerForLogin,
	checkerForSignUp,
} = require('../validation/validatorForLoginAndSignUp');

const authRouter = express.Router();
/*
authRouter.post('/login',(req,res,next)=>{

});
*/

authRouter.post('/signup', checkerForSignUp, postSignUp);
authRouter.post('/login', checkerForLogin, postLogin);

module.exports = {
	authRouter,
};
