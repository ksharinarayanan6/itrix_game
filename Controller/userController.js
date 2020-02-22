const User = require("../models/user");

exports.addUserForm = (req, res, next) => {
    res.render('addUserForm', {
        //csrfToken: res.locals.csrfToken
    });
};

exports.addUser = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    const user = new User({username: username, password: password, name: name});
    user.save()
    .then(
        console.log("User created successfully!"),
        res.redirect("/addUserForm/")
    )
    .catch(err => {
        console.log(err);
    });
};

exports.loginForm = (req, res, next) => {
    if(res.locals.session.email)
        res.redirect("/logged/");
    res.render("loginForm", {
        message: ""
        //csrfToken: res.locals.csrfToken
    });
};

exports.loginCheck = (req, res, next) => {
    var credentials = {email: req.body.email, password: req.body.password};
    User.find(credentials)
    .then(user => {
        //console.log(user);
        if(JSON.stringify(user) !== JSON.stringify([])){
            res.locals.session.email = req.body.email;
            res.redirect("/logged/");
        }
        else{
            res.redirect("/login/");
        }
    })
    .catch(err => {
        console.log(err);
    });
};

exports.loggedPage = (req, res, next) => {
    User.find({email: res.locals.session.email})
    .then(user => {
        const jsonFile = require("../JSON/question.json");
        //console.log("Welcome " + user);
        const q = jsonFile[user[0].level - 1];
        console.log(q);
        res.render("logged", {         
            loggedUser: user,
            level: user[0].level,
            question: q
        });
    })
    .catch(err => {
        console.log(err);
    });
};


exports.landingPage = (req, res, next) => {
    res.render("landingPage", {
        //csrfToken: res.locals.csrfToken
    });
}

exports.validateAnswer = (req, res, next) => {
    
    console.log("Your email is " + res.locals.session.email);
    User.findOne({email: res.locals.session.email})
    .then(user => {
        //console.log("hi " + user);
        //console.log("welcome " + user.name);
        console.log("your level is " + user.level);
        var i = user.level - 1;
        const tex = res.locals.text;
            
        const jsonParsed = require("../JSON/question.json");
        console.log("The answer is " + jsonParsed[i].answer);
        if (jsonParsed[i].answer === tex) {
                res.json({ data: "1", path: jsonParsed[i + 1].question, number: jsonParsed[i].number, gif: jsonParsed[i].gif });
                i = i + 1;
                var myquery = { email: res.locals.session.email };
                var newvalues = { $set: {level: i+1 } };
                User.updateOne(myquery, newvalues, function(err, res){
                    if(err) throw err;
                    console.log("Level updated");
                });
            }
            else {
                console.log(jsonParsed[i].gif);
                res.json({ data: "0" });
            }
    });
    
    //var i = u.level;
    
    /*
    if(res.locals.session.email){
        User.find({email: res.locals.session.email})
        .then(user =>{
            i = user.level;
        });
    }
    */
   
}