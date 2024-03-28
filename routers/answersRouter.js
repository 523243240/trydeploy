const express = require('express');
const answersRouter = express.Router();

let Answer = require('../models/answers');
const { deleteAnswers } = require('../utils');
const User = require('../models/users');
const Question = require('../models/questions');
const invalidSession = require('../middleware/invalidSession');

answersRouter.use("/*", (req, res, next) => {
    if (req.method !== "GET")
        return invalidSession(req, res, next);
    return next();
});

/**
 * Sends all answers.
 */
answersRouter.get("/all", (req, res) => {
    Answer.find({}).then((answer) => res.send(answer));
});

/**
 * Adds an answer. Validation errors get forwarded to error handler.
 */
answersRouter.post("/add", (req, res, next) => {
    createAnswer(req.body).then((answer) => { 
        console.log(`New Answer Added`); 
        return res.send(answer);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Adds comments to an answer. Path should end with /_id/add, obtained by answer.url + "/add".
 */
answersRouter.put("/:id/add", (req, res, next) => {
    Answer.findByIdAndUpdate(req.params.id, { $addToSet: { comments: req.body.comments }, $inc: { votes: (req.body.votes) ? req.body.votes : 0 }}, { returnDocument: "after" }).then((answer) => {
        console.log(`Answer Updated`);
        if (req.body.votes) {
            let votes = req.body.votes;
            User.findByIdAndUpdate(answer.ans_by, { $inc: { reputation: (votes > 0) ? 5 * votes : 10 * votes }}).then(() => { return res.send(answer) });
        }
        else
            return res.send(answer); 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Updates an answer. Path should end with /_id, obtained by answer.url.
 */
answersRouter.put("/:id", (req, res, next) => {
    Answer.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" }).then((answer) => {
        console.log(`Answer Updated`);
        return res.send(answer); 
    }).catch((err) => {
        return next(err);
    });
    
});


/**
 * Deletes an answer. Path should end with /_id, obtained by answer.url.
 */
answersRouter.delete("/*", (req, res, next) => {
    let id = req.params[0];
    deleteAnswers([id]).then((numDeleted) => { 
        console.log(`${numDeleted} answer${(numDeleted !== 1) ? 's' : ''} deleted`);
        return res.send({ numDeleted: numDeleted }); 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Retrieves an answer with a given id. Expected to be of the form /_id.  Path should be obtained by answer.url.
 */
answersRouter.get("/*", (req, res, next) => {
    let id = req.params[0];
    getAnswer(id).then((answers) => {
        return res.send(answers[0]);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * @param id id of the answer
 * @returns the query resulting from Answer.find
 */
function getAnswer(id) {
    return Answer.find({ _id: id }).populate("ans_by", "username").populate({
        path: "comments",
        model: "Comment",
        populate: { path: "user", model: "User", select: "username"}
    });
}

/**
 * Creates a new answer.
 * @param answer.question the question this answer is for
 * @param answer.text text of the answer. (Required field)
 * @param answer.ans_by username of the answerer. (Required field)
 * @param answer.ans_date_time time the answer was made. (Default current date)
 * @param answer.votes number of votes the question has. (Default 0)
 * @param answer.comments array of Comment ObjectIds. (Default [])
 * @returns the promise containing the new answer
 */
async function createAnswer({ question, text, ans_by, ans_date_time, votes, comments }) {
    if (!question) //Don't create answer if question isn't provided
        return null;
    let answerDetails = {
        text: text,
        ans_by: ans_by
    };
    if (ans_date_time) answerDetails.ans_date_time = ans_date_time;
    if (votes) answerDetails.votes = votes;
    if (comments) answerDetails.comments = comments;
  
    let answer = new Answer(answerDetails);
    answer = await answer.save();
    await Question.findByIdAndUpdate(question._id, { $addToSet: { answers: answer._id }});
    await User.findByIdAndUpdate(ans_by, { $addToSet: { answers: answer._id }});
    return answer;
}


module.exports = answersRouter;