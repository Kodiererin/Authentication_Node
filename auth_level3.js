// This is Level 3 Encryotion.
//////////// Hashing Method //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

require('dotenv').config(); // Installed npm i dotenv

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();


app.use(express.static('public'));
app.set('view engine' , 'ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));
const mongoose = require('mongoose');

// Acquiring MD5 for Hashing Encryption
const md5 = require('md5');



main().catch(err => console.log(err));

console.log(process.env.UJJWAL);

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Login');
  console.log("Database Connected");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
};


mongoose.set('strictQuery' , true);

const userSchema = new mongoose.Schema({
    email : {
        type : String,
    },
    password : {
        type : String,
    }
});

// const secret = "This is a Little Secret"; this has been shifted to .env file

const user = new mongoose.model('user',userSchema);


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
    const newUser = new user({
        email : req.body.username,
        password : md5(req.body.password),           // changes has been done here
    });

    console.log(newUser);

    newUser.save(function(err,result){
        if(!err && result){
            console.log('Registration successful');
            // res.render('login')
            res.render('secrets');
        }
    })
})


app.post('/login',function(req,res){
    const username = req.body.username;
    const password = md5(req.body.password);
    console.log(username+"    "+password);
    user.findOne(
        {email : username},
        function(err,found){
            if(!err && found){
                if(found.password===password){
                    console.log("Logged in Successfully");
                    res.render('secrets');
                }
                else{
                    console.log("Password Not Matched");
                }
            }
            else{
                console.log("Data Not Found");
            }
        }
    )
})





app.listen(3000,function(){
    console.log("Server Connected to Port 3000");
})


