const express = require("express");
const router = express.Router();
const csrf = require("csurf");

var session = require("express-session");

//var loginFail = 0;
//router.use(csrfProtection);

const userController = require("../Controller/userController");

router.post("/addUser/", function(req, res, next){
    res.locals.session = req.session;
    next()
},
userController.addUser);

router.get("/logged/", function (req, res, next) {

    if (!req.session.email){
        //req.session.email = "hari@gmail.com";
        res.redirect("/");
    }
    
    res.locals.session = req.session
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    })
    next()
},
    userController.loggedPage
);

router.post("/loginCheck/", function (req, res, next) {
    res.locals.session = req.session;
    res.locals.session.loginFail = 0;
    next();
},
    userController.loginCheck
);

router.get("/logout/", function (req, res, next) {
    req.session.email = null;
    res.redirect("/");
});

router.get("/", function (req, res, next) {
    if (req.session.email)
        res.redirect("/logged/");
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    })
    res.locals.session = req.session;
    next()
},
    userController.landingPage
);

router.post("/validateAnswer/", function (req, res, next) {
   res.locals.session = req.session
   res.locals.text = req.body.name
   next()
},
    userController.validateAnswer
);

module.exports = router;

router.post("/checkEmail/", function(req, res, next){
    //console.log(req.body.email);
    res.locals.email = req.body.email
    next()
},
    userController.checkEmail
);

router.post("/logged/", function(req, res, next){
    res.redirect("/logged/");
});

router.get("/franchise/", userController.franchise);

router.post("/addFranchise/", function(req, res, next){
    res.locals.email = req.session.email;
    res.locals.franchise = req.body.franchise;
    next()
},
userController.addFranchise
);

router.get("/playerSelect/", userController.player);

module.exports = router;