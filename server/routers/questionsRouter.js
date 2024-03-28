const express = require('express');
const questionsRouter = express.Router();

let Question = require('../models/questions');
let User = require('../models/users');
let Tag = require('../models/tags');
let { sortQuestions, deleteQuestions, deleteTags, getAndCreateTags } = require('../utils');
const invalidSession = require('../middleware/invalidSession');

questionsRouter.use("/*", (req, res, next) => {
    if (req.method !== "GET")
        return invalidSession(req, res, next);
    return next();
});

/**
 * Retrieves all questions assoicated with the user id.
 */
questionsRouter.get("/all/:userid", (req, res, next) => {
    User.findById(req.params.userid).then((user) => {
        populateQuestions(Question.find({ _id: { $in: user.questions }})).then((questions) => res.send(questions));
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Retrieves all questions.
 * @param req.query.sortBy a number (0, 1, 2) corresponding to (NEWEST, ACTIVE, UNANSWERED) a sorting method.
 */
questionsRouter.get("/all", (req, res, next) => {
    let sortBy = 0;
    if (req.query.sortBy)
        sortBy = Number.parseInt(req.query.sortBy);

    findQuestion({}).then((questions) => {
        questions = sortQuestions(questions, sortBy);
        return res.send(questions);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Retrieves all questions that the user has answered.
 */
questionsRouter.get("/answered/:userid", (req, res, next) => {
    Question.find({}).populate("tags")
    .populate("answers", null, { ans_by: req.params.userid }).then((questions) => {
        let questionIds = questions.filter(q => q.answers.length !== 0).map(q => q._id);
        findQuestion({ _id: { $in: questionIds}}).then((questions) => {
            return res.send(questions);
        })
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Adds a new question. Validation errors get forwarded to error handler.
 */
questionsRouter.post("/add", (req, res, next) => {
    createQuestion(req.body).then((question) => { 
        console.log(`New Question Added`); 
        return res.send(question) 
    }).catch((err) => {
        return next(err);
    });
});


/**
 * Adds comments/answers to a question. Path should end with /_id/add, obtained by question.url.
 */
questionsRouter.put("/:id/add", (req, res, next) => {
    Question.findByIdAndUpdate(req.params.id, { $addToSet: { answers: req.body.answers, comments: req.body.comments }, $inc: { votes: (req.body.votes) ? req.body.votes : 0 }}, { returnDocument: "after" }).then((question) => {
        console.log(`Question Updated`);
        if (req.body.votes) {
            let votes = req.body.votes;
            User.findByIdAndUpdate(question.asked_by, { $inc: { reputation: (votes > 0) ? 5 * votes : 10 * votes }}).then(() => { return res.send(question); });
        }
        else
            return res.send(question); 
    }).catch((err) => {
        return next(err);

    });
});


/**
 * Updates a question. Path should end with /_id, obtained by question.url.
 */
questionsRouter.put("/:id", async (req, res, next) => {
    try {
        let question = await Question.findById(req.params.id);
        await updateQuestion(question, req.body);
        console.log(`Question Updated`);
        return res.send(question);
    }
    catch (err) {
        return next(err);
    }
});

/**
 * Gets a question(updates view counter). Path should end with /_id/view, obtained by question.url.
 */
questionsRouter.get("/:id/view", async (req, res, next) => {
    try {
        let question = await Question.findById(req.params.id);
        await updateQuestion(question, { views: question.views + 1 });
        console.log(`Question Updated`);
        return res.send(question);
    }
    catch (err) {
        return next(err);
    }
});

/**
 * Deletes a question. Path should end with /_id, obtained by question.url.
 */
questionsRouter.delete("/*", (req, res, next) => {
    let id = req.params[0];
    deleteQuestions([id]).then((numDeleted) => { 
        console.log(`${numDeleted} question${(numDeleted !== 1) ? 's' : ''} deleted`);
        return res.send({ numDeleted: numDeleted }); 
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Does a search given a query string of words and tags.  
 */
questionsRouter.get("/search", (req, res, next) => {
    //Regex by default rejects all
    let tagNames = []
    let wordRegex = /.^/;
    if (req.query.words) {
        let words = req.query.words.split(" ").filter((t) => t.length > 0);  //Filter out all whitespace
        //Escape all regex metacharacters before creating the regex.
        let regexMetaCharacters = /([\[\]\^\$\|\(\)\\\+\*\?\{\}\=\!\.])/g; //eslint-disable-line
        words = words.map(word => word.toLowerCase().replace(regexMetaCharacters, '\\$1'));
        //Regex used to ensure that the search results have at least a full WORD from the search string rather than as a substring.
        wordRegex = new RegExp("\\b" + words.join("\\b|\\b") + "\\b", "i");
    }
    if (req.query.tags) {
        tagNames = req.query.tags.split(" ").filter((t) => t.length > 0); 
        tagNames = tagNames.map((tagName) => tagName.toLowerCase());
    }

    Tag.find({ name: { $in: tagNames }}).then((tags) => {
        tags = tags.map((tag) => tag._id);
        findQuestion({$or: [{title: { $regex: wordRegex }}, {text: { $regex: wordRegex }}, {tags: { $in: tags }}]}).then((questions) => {
            return res.send(questions);
        }).catch((err) => {
            return next(err);
        });
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Retrieves a question with a given id. Expected to be of the form /_id.  Path should be obtained by question.url.
 */
questionsRouter.get("/:id", (req, res, next) => {
    getQuestion(req.params.id).then((question) => {
        return res.send(question);
    }).catch((err) => {
        return next(err);
    });
});

/**
 * Gets a question given the id.
 * @param id id of the answer
 * @returns the query resulting from Question.find
 */
function getQuestion(id) {
    return populateQuestions(Question.findById(id));
}

/**
 * Queries for questions given a JSON object.
 * @param query JSON object that will be used in Question.find().
 * @returns the query object returned from Question.find().
 */
function findQuestion(query) {
    return populateQuestions(Question.find(query));
}

/**
 * Populates the question query
 * @param query the query to be populated
 * @returns the populated query object
 */
function populateQuestions(query) {
    return query.populate("tags").populate({ 
        path: "answers", 
        model: "Answer",
        populate: [{ path: "ans_by", select: "username"}, { path: "comments", model: "Comment", populate: { path: "user", model: "User", select: "username"}}]})
    .populate('asked_by', 'username')
    .populate({
        path: "comments",
        model: "Comment",
        populate: { path: "user", model: "User", select: "username" }
    });
}

/**
 * Creates a new question.
 * @param question.title title of the question. (Required field)
 * @param question.summary summary of the question. (Required field)
 * @param question.text text of the question. (Required field)
 * @param question.tagNames array of tag names.
 * @param question.asked_by User ObjectId that asked this question. (Required field)
 * @param question.answers array of Answer ObjectIds. (Default [])
 * @param question.ask_date_time date the question was asked. (Default current date)
 * @param question.views number of views the question has. (Default 0)
 * @param question.votes number of votes the question has. (Default 0)
 * @param question.comments array of Comment ObjectIds. (Default [])
 * @returns promise to the new question
 */
async function createQuestion({ title, summary, text, tagNames, asked_by, answers, ask_date_time, views, votes, comments }) {
    let tags = [];
    tagNames = tagNames.map(tn => tn.toLowerCase());
    //Only create tags if all the required fields and their constraints are met
    if (title && title.length <= 50 && summary && summary.length <= 140 && text && tagNames && asked_by)
        tags = await getAndCreateTags(tagNames, asked_by);
    let questionDetails = {
      title: title,
      summary: summary,
      text: text,
      tags: tags,
      asked_by: asked_by,
    }
    if (answers) questionDetails.answers = answers;
    if (ask_date_time) questionDetails.ask_date_time = ask_date_time;
    if (views) questionDetails.views = views;
    if (votes) questionDetails.votes = votes;
    if (comments) questionDetails.comments = comments;
  
    let question = new Question(questionDetails);
    question = await question.save();

    //Add question to the appropriate user
    await User.findByIdAndUpdate(question.asked_by, { $addToSet: { questions: question._id }});

    return question;
}


/**
 * Updates a question.
 * @param question.title title of the question. 
 * @param question.summary summary of the question. 
 * @param question.text text of the question. 
 * @param question.tagNames array of tagNames 
 * @param question.answers array of Answer ObjectIds.
 * @param question.ask_date_time date the question was asked.
 * @param question.views number of views the question has. 
 * @param question.votes number of votes the question has. 
 * @param question.comments array of Comment ObjectIds. 
 * @returns the save promise returned from save() function call.
 */
async function updateQuestion(question, { title, summary, text, tagNames, answers, ask_date_time, views, votes, comments }) {
    if (title) question.title = title;
    if (summary) question.summary = summary;
    if (text) question.text = text;
    //If we're changing our array of tags, which which ones to remove and remove it from the user if necessary and delete the tag if necessary
    if (tagNames && (!title || title.length <= 50) && (!summary || summary.length <= 140)) {
        let newQuestionTags = await getAndCreateTags(tagNames, question.asked_by); //Get the array of new tag ids
        let removedTags = [];
        //Get an array of tags ids to be removed from the question
        for (let i = 0; i < question.tags.length; i ++) {
            let shouldRemove = true;
            for (let j = 0; j < newQuestionTags.length; j ++) {
                if (newQuestionTags[j].equals(question.tags[i])) {
                    shouldRemove = false;
                    break;
                }
            }
            if (shouldRemove)
                removedTags.push(question.tags[i]);
        }
        question.tags = newQuestionTags;
    }
    if (answers) question.answers = answers;
    if (ask_date_time) question.ask_date_time = ask_date_time;
    if (views) question.views = views;
    if (votes) question.votes = votes;
    if (comments) question.comments = comments;

    return question.save();
}

module.exports = questionsRouter;