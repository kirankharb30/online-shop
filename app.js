const path = require('path');

const express = require('express');

const multer=require('multer');
const bodyParser = require('body-parser');

const session =require('express-session');
const mongoDBStore=require('connect-mongodb-session')(session);
const csrf=require('csurf');
const flash=require('connect-flash');

const errorController = require('./controllers/error');

const mongoose = require('mongoose');

//const mongoConnect=require('./util/database').mongoConnect; 
const User=require('./models/user');
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes=require('./routes/auth');

const MONGODB_URI='mongodb+srv://kirankharb:kiran@561973@cluster0-6epac.mongodb.net/shop?retryWrites=true&w=majority';
const store=new mongoDBStore({
  uri:MONGODB_URI,
  collection:'sessions'
});
const csrfProtection=csrf();

const fileStorage=multer.diskStorage({
   destination:(req,file,cb)=>{
     
     cb(null,'images');
   },
   filename:(req,file,cb)=>{
     
     cb(null,new Date().toISOString+'-'+ file.originalname);
   }
});

const fileFilter=(req,file,cb)=>{
  console.log(file);
  if(file.mimetype==='image/png'||file.mimetype==='image/jpg' ||file.mimetype==='image/jpeg'){
    
    cb(null,true);
  }
  else{
    console.log("fuk");
    cb(null,false);
  }
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  multer({ storage:fileStorage, fileFilter: fileFilter }).single('image')
);


app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));


app.use(
  session({
    secret:'my secret',
    resave:false,
    saveUninitialised:false,
    store:store
  })
);
app.use(csrfProtection);
app.use(flash());

app.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn;
  res.locals.csrfToken=req.csrfToken(); 
  next();
})

app.use((req,res,next)=>{
  if(!req.session.user){
    return next();
  }
  User.findById(req.session.user._id)
  .then(user=>{
    if(!user)
    {
      return next();
    }
      req.user=user;
      next();
  })
  .catch(err=>{
    //console.log(err);
    // throw new Error(err);==this doesnot redirect to 500 page ,as it is in a promise
    next(new Error(err));
  });

});
/*db.execute('select * products  ')
  .then(result=>{
      console.log(result);
  })
  .catch(err=>{
      console.log(err);
  });
*/

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
  
 
app.use(errorController.get404);

app.get('/500',errorController.get500);
app.use((error,req,res,next)=>{
   // res.status(error.httpStatusCode).render(........)
    res.status(500).render('500', { 
    pageTitle: 'Error!',
    path: '/500',
   // isAuthenticated: req.session.isLoggedIn
  });
 });

//app.listen(8000);
mongoose.connect(MONGODB_URI  ,{useUnifiedTopology: true, useNewUrlParser: true })
.then(result=>{

  //User.findOne().then(user=>{
  //    if(!user)
  //    {
  //       const user=new User({
  //       name:'kiran',
  //       email:'kirankharb36@gmail.com',
  //       cart:{
  //         items:[]
  //       }
  //     });
  //     user.save();
  //    }
  // }); 
  console.log("CONNECTED!!");
  app.listen(8000);
})
.catch(err=>{
  console.log(err);
});
//{"_id":{"$oid":""},"name":"max","email":"max@test.com"}