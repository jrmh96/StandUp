var express = require('express');
var router = express.Router();


// GET /
// Welcome page
router.get('/', function(req, res, next){
    return res.render('welcome');
});

// GET /Register
router.get('/register', function(req, res, next){
    return res.render('register')
});

// POST /Register

// GET /Login
router.get('/login', function(req, res, next){
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

router.get('/home', function(req, res, next){
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