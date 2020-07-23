const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');
const { body }=require('express-validator/check');
const router = express.Router();
const isAuth=require('../middleware/is-auth');
// /admin/add-product => GET
router.get('/add-product', isAuth,adminController.getAddProduct);

// // /admin/products => GET
 router.get('/products', adminController.getProducts);

// /admin/add-product => POST
router.post('/add-product', 

     [
       body('title').isString().isLength({min:3}).trim(),
       
       body('price',).isFloat(),
       body('description').isLength({min:3,max:400}).trim()
   ],

adminController.postAddProduct);

 router.get('/edit-product/:productId', adminController.getEditProduct);

 router.post('/edit-product', 
   [
       body('title').isString().isLength({min:3}).trim(),
      
       body('price').isFloat(),
       body('description').isLength({min:3,max:400})
       .trim()
   ],
   isAuth,adminController.postEditProduct
 );

 router.post('/delete-product',isAuth, adminController.postDeleteProduct);

module.exports = router;
  