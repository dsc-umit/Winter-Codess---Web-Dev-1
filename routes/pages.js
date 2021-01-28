const express = require('express');
const User = require('../core/user');
const router = express.Router();
const nodemailer = require('nodemailer');
const pool = require('../core/pool');

// create an object from the class User in the file core/user.js
const user = new User();
// Get the index page
router.get('/', (req, res, next) => {
    let user = req.session.user;
    // If there is a session named user that means the use is logged in. so we redirect him to home page by using /home route below
    if(user) {
        res.redirect('/home');
        return;
    }
    // IF not we just send the index page.
    res.render('index.ejs',);
})

// Get home page
router.get('/home', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('admin/index.ejs', {opp:req.session.opp, name:user.fullname});
        return;
    }
    res.redirect('/');
});
router.get('/cart', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('admin/cart.ejs', {opp:req.session.opp, name:user.fullname});
        return;
    }
    res.redirect('/');
});
router.get('/about', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('admin/about.ejs', {opp:req.session.opp, name:user.fullname});
        return;
    }
    res.redirect('/');
});
router.get('/contact', (req, res, next) => {
    let user = req.session.user;

    if(user) {
        res.render('admin/contact.ejs', {opp:req.session.opp, name:user.fullname});
        return;
    }
    res.redirect('/');
});
// Post login data
router.post('/login', (req, res, next) => {
    // The data sent from the user are stored in the req.body object.
    // call our login function and it will return the result(the user data).
    user.login(req.body.username, req.body.password, req.body.active, function(result) {
        if(result && result.active == 1) {
            // Store the user data in a session.
            req.session.user = result;
            req.session.opp = 1;
            // redirect the user to the home page.
            res.redirect('/home');
        }else if(result.active == 0) {
            res.send('Email not verified!');
        }else {
            // if the login function returns null send this error message back to the user.
            res.send('Username/Password incorrect!');
        }
    })

});


// Post register data
router.post('/register', (req, res, next) => {
    // prepare an object containing all user inputs.
    let userInput = {
        username: req.body.username,
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
        active: 0
    };
    // call create function. to create a new user. if there is no error this function will return it's id.
    user.create(userInput, function(lastId) {
        // if the creation of the user goes well we should get an integer (id of the inserted user)
        if(lastId) {
            // Get the user data by it's id. and store it in a session.
            // user.find(lastId, function(result) {
            //     req.session.user = result;
            //     req.session.opp = 0;
            //     res.redirect('/');
            // });
            console.log("User created successfully!");

        }else {
            console.log('Error creating a new user ...');
        }
    });

});

const smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "wintercodess.webdev1@gmail.com",
        pass: "webdev1_5"
    }
});
let rand, mailOptions, host, link, mail;
/*------------------SMTP Over-----------------------------*/

/*------------------Routing Started ------------------------*/

router.get('/send',function(req,res){
    rand=Math.floor((Math.random() * 10000) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.query.to,
        subject : "SmartCart: Please confirm your Email account",
        html : "<h1>Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a></h1>" 
    }
    console.log(mailOptions);
    mail = req.query.to;
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        res.end("error");
     }else{
        console.log("Message sent: " + response.message);
        res.end("sent");
     }
});
});

router.get('/verify',function(req,res,next){
console.log(req.protocol+":/"+req.get('host'));
if((req.protocol+"://"+req.get('host'))==("http://"+host))
{
    console.log("Domain is matched. Information is from Authentic email");
    if(req.query.id==rand)
    {
        console.log("email is verified");
        // res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
        res.render("verify.ejs", {mail: mailOptions.to, link: "http://localhost:3000/"});
        pool.query("UPDATE users SET active=1 WHERE email=? ", [mail], 
            function(err, result) {
                if(err) {
                    next(err);
                    return;
                }
            })    
    }
    else
    {
        console.log("email is not verified");
        res.end("<h1>Bad Request</h1>");
    }
}
else
{
    res.end("<h1>Request is from unknown source");
}
});

/*--------------------Routing Over----------------------------*/

// Get loggout page
router.get('/loggout', (req, res, next) => {
    // Check if the session is exist
    if(req.session.user) {
        // destroy the session and redirect the user to the index page.
        req.session.destroy(function() {
            res.redirect('/');
        });
    }
});

module.exports = router;