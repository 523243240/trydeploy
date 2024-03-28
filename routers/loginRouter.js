const express = require('express');
const bcrypt = require('bcrypt');
const { basicUserInfo, detailedUserInfo } = require('../utils');
const loginRouter = express.Router(); 

const User = require('../models/users');

/**
 * This end point will attempt to login using the username and password embedded into the request body.
 * If the login credentials are invalid, then it will throw an InvalidLoginError.
 * If login was successful, it will return the username.
 */
loginRouter.post('/login', (req, res, next) => {
    let email = req.body.email;
    User.findOne({ email: email }).then((user) => {
        //If we can't find the username or the passwords don't match, throw an error
        if (user && user.password === bcrypt.hashSync(req.body.password, user.salt)) {
            console.log(`Logging in ${user.username}`);
            req.session.user = detailedUserInfo(user);
        }
        if (req.session.user)
            return res.send(req.session.user);
        else {
            //Can't find user
            let err = new Error("Email or password is invalid");
            err.name = "InvalidLoginError";
            throw err;
        }
    }).catch((err) => {
        return next(err);
    })
    

});

loginRouter.post('/logout', (req, res, next) => {
    if (req.session.user) {
        console.log(`Logging out ${req.session.user.username}`);
        req.session.destroy((err) => { 
            if (err) { 
                console.log(err); 
                return next(err);
            }
            return res.send("Successfully logged out");
        });
    }
    else {
        console.log("Logging out guest");
        return res.send("Successfully logged out guest");
    }
});

//check if email already exist  
loginRouter.post('/email', (req, res, next) => {
    let email = req.body.email; 
    let resp = false; 
    User.findOne({email:email}).then((user)=>{
        if(user){
            return res.send(resp); 
        }
        else{
            resp = true; 
            return res.send(resp); 
        }
    }).catch((err)=>{
        return next(err);
    })
})
;

//check if user has session already 
loginRouter.get('/session', (req, res) => {
    return res.send(req.session.user);
});



module.exports = loginRouter;

