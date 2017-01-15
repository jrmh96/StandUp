var express = require('express');
var router = express.Router();
var User = require("../models/users");
var mid = require('../middleware');

// GET /
// Welcome page
router.get('/', function(req, res, next){
    return res.render('welcome');
});

// GET /Register
router.get('/register', mid.loggedOut, function(req, res, next){
    return res.render('register')
});

// POST /Register
router.post('/register', function(req, res, next){
    if(req.body.first &&
    req.body.last &&
    req.body.email &&
    req.body.location &&
    req.body.password &&
    req.body.confirmPassword){
        
        //confirm that user typed the same password twice
        if(req.body.password !== req.body.confirmPassword){
            var err = new Error('Passwords do not match.');
            err.status = 400;
            return next(err);
        }

        // create object with all the form information

        var userData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            location: req.body.location,
            email: req.body.email,
            password: req.body.password
        };

        // use schema's 'create' method to insert document into Mongo
        User.create(userData, function(error, user){
            if(error) {
                return next(error);
            } else {
                req.session.userId = user._id; //once you register, you immediately become logged in
                return res.redirect('/profile');
            }
        });

    }else {
        var err = new Error('All Fields Required');
        err.status = 400;
        return next(err);
    }
});

// GET /Login
router.get('/login', mid.loggedOut, function(req, res, next){
    return res.render('login');
})

// POST /Login
router.post("/login", function(req, res, next){
    if(req.body.email && req.body.password){
        User.authenticate(req.body.email, req.body.password, function(error, user){
            if(error || !user){
                var err = new Error('Wrong email or password');
                err.status = 401;
                return next(err);
            }
            else{
                req.session.userId = user._id;
                return res.render("homePage");
            }
        });
    }
})

//GET homePage

router.get('/home', mid.loggedIn, function(req, res, next){
    return res.render('homePage');
})

// GET /logout
router.get('/logout', function(req, res, next){
    if(req.session){
        //delete session object
        req.session.destroy(function(err){
            if(err){
                return next(err);
            }
            else{
                return res.redirect("/");
            }
        });
    }
});

module.exports=router;