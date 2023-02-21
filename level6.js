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


app.get('/',function(req,res){
    res.render('home');
})

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


