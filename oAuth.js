// This is Level 5 Encryotion.
//////////// Using Passport JS //////////////////////////////////////////////////
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const app = express();

// implementing Google Strategy.
var GoogleStrategy = require('passport-google-oauth20').Strategy; 
var findOrCreate = require('mongoose-findorcreate');



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
// findOrcreate plugin
userSchema.plugin(findOrCreate);


// const secret = "This is a Little Secret"; this has been shifted to .env file

const user = new mongoose.model('user',userSchema);

passport.use(user.createStrategy());


// passport.serializeUser(user.serializeUser());
// passport.deserializeUser(user.deserializeUser());


passport.serializeUser(function(user, done) {
    done(null, user);
    console.log('====================================');
    console.log(user);
    console.log('====================================');
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
    console.log('====================================');
    console.log(user);
    console.log('====================================');
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://localhost:3000/auth/google/secrets",
    userProfileURL : "https://www.googleapis.com/oauth2/v3/userinfo"        // this was an extra line added for authenticating google profile.
    // if google api profile deprecates then this url will be used.
  },

  
  function(accessToken, refreshToken, profile, cb) {
    console.log(accessToken);
    // findorcreate is a dummy code which is telling to write your own code but we'll be installing npm mongoose findorcreate package by by installling it
    // tha package name is npm i mongoose-findorcreate
    user.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));
// accesstoken : allows us to get users data.


app.get('/',function(req,res){
    res.render('home');
})
// Authentication with google
app.get("/auth/google",
    passport.authenticate('google', { scope: ["profile"] })// we are using google strategy so we are using google

)
app.get('/auth/google/secrets', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });


app.get('/login',function(req,res){
    res.render('login');
})

app.get('/register',function(req,res){
    res.render('register');
})

app.get('/secrets' , function(req,res){
    // checking if the user is logged in or not (by cookies)
    if(req.isAuthenticated()){
        res.render('secrets');
    }

    else{
        res.redirect("/login");
    }
})

app.post('/register',function(req,res){
    // using passport local package to use it.
    user.register({username : req.body.username}, req.body.password , function(err,user){
        if(err){
            console.log(err);
            res.redirect('/register');
        }else{
            // we are using the type of authentication called local
            // authrntication will be successful if we manages to set up the cookie that saved their logged in sesstion
            // and we have to check if they are logged in or not 
            passport.authenticate("local")(req,res , function(){
                res.redirect('/secrets');
            })
        }
    });

})

// const LocalStrategy = require('passport-local').Strategy;

// passport.use(new LocalStrategy(
//     function(username, password, done) {
//       User.findOne({ username: username }, function (err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }
//         if (!user.verifyPassword(password)) { return done(null, false); }
//         return done(null, user);
//       });
//     }
//   ));

app.post('/login',function(req,res){
    const newUser = new user({
        email : req.body.username,
        password : req.body.pasword
    })

    // using login function of passport
    req.logIn(newUser , function(err){
        if(err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect('/secrets');
            })
        }
    })

})
app.get('/logout',function(req,res){
    req.logout(function(err,accept){
        if(!err){
            res.redirect("/");
        }else{
            console.log('====================================');
            console.log("Error");
            console.log('====================================');
        }
    });
    
})






app.listen(3000,function(){
    console.log("Server Connected to Port 3000");
})


