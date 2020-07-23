const express = require('express');
const authController=require('../controllers/auth');
const router = express.Router();
const {check,body}=require('express-validator/check');
const User=require('../models/user');

router.get('/login',authController.getLogin);
router.post('/login',
    [
         body('email')
         .isEmail()
         .withMessage('enter a valid email')
         .normalizeEmail()
         ,

         body('password')
         .isLength({min:5})
         .withMessage('enter a valid password')
         .isAlphanumeric()
         
    ],
     authController.postLogin
     );


router.post('/logout',authController.postLogout);
router.get('/signup',authController.getSignup);


router.post(
    '/signup',
    [
    check('email')
    .isEmail()
    .withMessage('please enter a valid email')
    .custom( (value,{req})=>{
        // if(value=='test@test,com'){
        //     throw new Error('This email address is forbidden.');
        // }
        // return true;   
    return User.findOne({ email: value })
    .then(userDoc => {
      if (userDoc) {
          return Promise.reject('Email exists already,please pick a different one');
        // req.flash('error', 'E-Mail exists already, please pick a different one.');
        // return res.redirect('/signup');
      }
     });
    })
    .normalizeEmail(),
    
    body('password','please enter a message with only numbers and text of length being atleast 5 charcters long')
    .isLength({min:5}).isAlphanumeric().trim(),

    body('confirmPassword').trim().custom((value,{req})=>{
        if(value!=req.body.password) {
            throw new Error('password have to match!'); 
        }
        return true;
    })
    ],
    authController.postSignup);

router.get('/reset',authController.getReset);
router.post('/reset',authController.postReset);
router.get('/reset/:token',authController.getNewPassword);
router.post('/new-password',authController.postNewPassword);
 
module.exports=router; 