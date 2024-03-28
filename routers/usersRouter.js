const express = require('express');
const bcrypt = require('bcrypt');
const { basicUserInfo, detailedUserInfo,deleteUser } = require('../utils');
const invalidSession = require('../middleware/invalidSession');
const adminRequired = require('../middleware/adminRequired');
const usersRouter = express.Router();


let User = require('../models/users');

//Make sure requests have a valid session
usersRouter.use("/*", (req, res, next) => {
    if (req.method !== 'POST')
        return invalidSession(req, res, next);
    return next();
});
//Make sure only admins can get all user data
usersRouter.use("/all", adminRequired);

/**
 * Sends all users.
 */
usersRouter.get("/all", (req, res, next) => {
    User.find({}).then((users) => { res.send(users.map(user => basicUserInfo(user)))});
});

/**
 * Adds an user. Validation errors get forwarded to error handler.
 */
usersRouter.post("/add", (req, res, next) => {
    createUser(req.body).then((user) => { 
        console.log(`New User Added`); 
        return res.send(basicUserInfo(user));
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Adds questions/tags/answers to a user. Path should end with /_id/add, obtained by user.url.
 */
usersRouter.put("/:id/add", (req, res, next) => {
    User.findByIdAndUpdate(req.params.id, { $addToSet: { questions: req.body.questions, answers: req.body.answers, tags: req.body.tags }}, { returnDocument: "after" }).then((user) => {
        console.log(`User Updated`);
        return res.send(basicUserInfo(user)); 
    }).catch((err) => {
        return next(err);

    });
});

/**
 * Updates an user. Path should end with /_id, obtained by user.url.
 */
usersRouter.put("/:id", (req, res, next) => {
    //If password is changed, generate new salt and hash 
    if (req.body.password) {
        req.body.salt = bcrypt.genSaltSync();
        let password = bcrypt.hashSync(req.body.password, req.body.salt);
        req.body.password = password;
    }
    User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" }).then((user) => {
        console.log(`User Updated`);
        return res.send(basicUserInfo(user)); 
    }).catch((err) => {
        return next(err);
    });
    
});

/**
 * Retrieves an user with a given id. Expected to be of the form /_id.  Path should be obtained by user.url.
 */
usersRouter.get("/:id", (req, res, next) => {
    User.findById(req.params.id).then((user) => {
        return res.send(detailedUserInfo(user));
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Delete an user with a given id. Expected to be of the form /_id.  Path should be obtained by user.url.
 */
usersRouter.delete("/*", (req, res, next) => {
    let id = req.params[0];
    deleteUser(id).then((userid)=>{
        console.log(`user ${userid} delete`);
        return res.send(userid)
    }).catch((err)=>{
        return next(err);
    })
});

/**
 * Creates a new user.
 * @param user.username username of the user. (Required field)
 * @param user.password password of the user. (Required field)
 * @param user.email email of the user. (Required field)
 * @param user.isAdmin flag whether the user is an admin user. 
 * @param user.questions array of Question ObjectIds created by the user
 * @param user.answers array of Answer ObjectIds created by the user
 * @param user.tags array of Tag ObjectIds created by the user
 * @param user.registerDate date of registration
 * @param user.reputation reputation of the user
 * @returns the save promise returned from save() function call.
 */
function createUser({username, password, email, isAdmin, questions, answers, tags, registerDate, reputation}) {
    let salt = bcrypt.genSaltSync();
    let userDetails = {
        username: username,
        password: bcrypt.hashSync(password, salt),
        salt: salt,
        email: email,
        isAdmin: (isAdmin) ? isAdmin : false
    };
    if (questions) userDetails.questions = questions;
    if (answers) userDetails.answers = answers;
    if (tags) userDetails.tags = tags;
    if (registerDate) userDetails.registerDate = registerDate;
    if (reputation) userDetails.reputation = reputation;
  
    let user = new User(userDetails);
    return user.save();
}

module.exports = usersRouter;