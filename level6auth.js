// This is Level 5 Encryotion.
//////////// Using Passport JS //////////////////////////////////////////////////
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();


app.use(express.static('public'));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));
// Setting passport packages.
app.use(session({
    secret : "Our Little Secret.",
    resave : false,
    saveUninitialized:false,
}));

app.use(passport.initialize());
app.use(passport.session());


main().catch(err => console.log(err));

console.log(process.env.UJJWAL);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Login');
  console.log("Database Connected");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};
mongoose.set('strictQuery' , true);
// mongoose.set('usecreatindex',true);




const userSchema = new mongoose.Schema({
    email : {
        type : String,
    },
    password : {
        type : String,
    }
});

userSchema.plugin(passportLocalMongoose);           // to hashpasswords.

// const secret = "This is a Little Secret"; this has been shifted to .env file

const user = new mongoose.model('user',userSchema);

passport.use(user.createStrategy());


passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.get('/',function(req,res){
    res.render('home');
})

app.get('/login',function(req,res){
    res.render('login');
})

app.get('/register',function(req,res){
    res.render('register');
})

app.post('/register',function(req,res){
    // using passport local package to use it.
    user.register({username : req.body.username}, req.body.password , function(err,user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            
        }
    });

})


app.post('/login',function(req,res){
    
})




app.listen(3000,function(){
    console.log("Server Connected to Port 3000");
})


