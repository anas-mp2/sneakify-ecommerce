const express=require('express');
const app=express();
const env=require('dotenv').config();
const db=require('./config/db');
const path=require('path');
const userRouter=require('./routes/userRouter');
const adminRouter=require('./routes/adminRouter');
const session=require('express-session');
const passport=require('./config/passport');
db();

app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use("/",userRouter);
app.use("/pageNotFound",userRouter);
app.use("/signup",userRouter);
app.use('/user/login',userRouter);
app.use("/user/signup",userRouter);
app.use('/admin',adminRouter);


app.set('view engine','ejs');
app.set('views',[path.join(__dirname,'views/user'),path.join(__dirname,'views/admin')]);

app.use(express.static(path.join(__dirname,'public')));




// app.get('/user/home', (req, res) => {
//     res.redirect('/'); // Serve home.ejs located in views/user folder
// });

// app.get('/user/signup',(req,res)=>{
//     res.render('signup');
// })

app.listen(process.env.PORT,()=>{
    console.log(`Your Server is running succesfully on port number ${process.env.PORT}`);
})