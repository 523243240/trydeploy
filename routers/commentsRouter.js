const express = require('express');
const commentsRouter = express.Router();

let Comment = require('../models/comments');
const { deleteComments } = require('../utils');
const Answer = require('../models/answers');
const Question = require('../models/questions');

/**
 * Sends all comments.
 */
commentsRouter.get("/all", (req, res) => {
    Comment.find({}).then((comment) => res.send(comment));
});

/**
 * Adds an comment. Validation errors get forwarded to error handler.
 */
commentsRouter.post("/add", (req, res, next) => {
    createComment(req.body).then((comment) => { 
        console.log(`New Comment Added`); 
        return res.send(comment);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Updates an comment. Path should end with /_id, obtained by comment.url.
 */
commentsRouter.put("/:id", (req, res, next) => {
    Comment.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after" }).then((comment) => {
        console.log(`Comment Updated`);
        return res.send(comment); 
    }).catch((err) => {
        return next(err);
    });
    
});

/**
 * Deletes an comment. Path should end with /_id, obtained by comment.url.
 */
commentsRouter.delete("/*", (req, res, next) => {
    let id = req.params[0];
    deleteComments([id]).then((numDeleted) => { 
        console.log(`${numDeleted} comments${(numDeleted !== 1) ? 's' : ''} deleted`);
        return res.send({ numDeleted: numDeleted }); 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Retrieves an comment with a given id. Expected to be of the form /_id.  Path should be obtained by comment.url.
 */
commentsRouter.get("/*", (req, res, next) => {
    let id = req.params[0];
    getComment(id).then((comments) => {
        return res.send(comments[0]);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * @param id id of the comment
 * @returns the query resulting from Comment.find
 */
function getComment(id) {
    return Comment.find({ _id: id }).populate("user", "username");
}

/**
 * Creates a new comment.
 * @param comment.question question that this comment is for (Required if comment.answer isn't defined)
 * @param comment.answer answer that this comment is for (Required if comment.question isn't defined)
 * @param comment.text text of the comment. (Required field)
 * @param comment.user User ObjectId of the commenter. (Required field)
 * @param comment.dateCommented date the answer was made (Default current date)
 * @param comment.votes number of votes the question has. (Default 0)
 * @returns the save promise returned from save() function call.
 */
async function createComment({ question, answer, text, user, dateCommented, votes, comments }) {
    if (!answer && !question)
        return;
    let commentDetails = {
        text: text,
        user: user
    };
    if (dateCommented) commentDetails.dateCommented = dateCommented;
    if (votes) commentDetails.votes = votes;
    if (comments) commentDetails.comments = comments;
  
    let comment = new Comment(commentDetails);
    comment = await comment.save();

    if (answer)
        //await Question.findByIdAndUpdate(question._id, { $addToSet: { comments: comment._id }});

        await Answer.findByIdAndUpdate(answer._id, { $addToSet: { comments: comment._id }});
    else
        await Question.findByIdAndUpdate(question._id, { $addToSet: { comments: comment._id }});
    return comment;
}

module.exports = commentsRouter;