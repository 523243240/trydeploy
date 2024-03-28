let Question = require('./models/questions');
let Answer = require('./models/answers');
let Comment = require('./models/comments');
let Tag = require('./models/tags');
let User = require('./models/users');
const { query } = require('express');

const SORTBY = {
    NEWEST: 0,
    ACTIVE: 1,
    UNANSWERED: 2
  }

function sortQuestions(questions, sortBy) {
    switch (sortBy) {
        case SORTBY.NEWEST:
            questions.sort((q1, q2) => { return q2.ask_date_time - q1.ask_date_time;});
            break;
        case SORTBY.ACTIVE:
            questions.sort(questionActiveCompare);
            break;
        case SORTBY.UNANSWERED:
            questions = questions.filter((q) => q.answers.length === 0);
            break;
        default:
            break;
    }
    return questions;
}

/**
* Compares the activity of two questions.
* @param {Question} q1 - first question to compare.
* @param {Question} q2 - second question to compare.
* @returns A negative number if q1 is more active than q2 and a positive number if q2 is more active.
*/
function questionActiveCompare(q1, q2)
{
    let q1Date = mostRecentAnswerDate(q1);
    let q2Date = mostRecentAnswerDate(q2);
    return q2Date - q1Date
}

/**
* Returns the question's most recent answer date
* @param {Question} question 
*/
function mostRecentAnswerDate(question) {
    if (question.answers.length === 0)
        return new Date(0); //Oldest date
    let mostRecent = question.answers[0];
    for (let i = 1; i < question.answers.length; i++) {
        if (mostRecent.ans_date_time < question.answers[i].ans_date_time)
            mostRecent = question.answers[i];
    }
    return mostRecent.ans_date_time;
}

function basicUserInfo(user) {
    return { _id: user._id, username: user.username, isAdmin: user.isAdmin };
}

function detailedUserInfo(user) {
    return { 
        _id: user._id, 
        username: user.username, 
        isAdmin: user.isAdmin, 
        questions: user.questions, 
        answers: user.answers, 
        tags: user.tags,
        registerDate: user.registerDate,
        reputation: user.reputation,
        url: user.url
    }
}


/**
 * Given an array of question ObjectIds, deletes all the questions, their answers, and their comments.
 * @param questionIds array of ObjectIds
 * @returns number of questions deleted
 */
async function deleteQuestions(questionIds) {
    let questions = await Question.find({ _id: questionIds });
    let answerIds = [];
    let commentIds = [];
    await questions.forEach(async (question) =>  {
        answerIds.push(...question.answers);
        commentIds.push(...question.comments);
        await User.findOneAndUpdate({ _id: question.asked_by }, { $pull: { questions: question._id }});
    });
    await deleteAnswers(answerIds);
    await deleteComments(commentIds);
    await Question.deleteMany({ _id: { $in: questionIds }});

    return questions.length;
}

/**
 * Given an array of answers ObjectIds, deletes all the answers and their comments.
 * @param answerIds array of ObjectIds
 * @returns number of answers deleted
 */
async function deleteAnswers(answerIds) {
    //Query for list of answers
    let answers = await Answer.find({ _id: {$in: answerIds }});
    let commentIds = [];
    await answers.forEach(async (answer) => {
        commentIds.push(...answer.comments);
        await User.findOneAndUpdate({ _id: answer.ans_by },  { $pull: { answers: answer._id }});
    });
    await deleteComments(commentIds);
    await Answer.deleteMany({ _id: { $in: answerIds }});

    return answers.length;
}

/**
 * Given an array of comment ObjectIds, deletes all the comments.
 * @param answerIds array of ObjectIds
 * @returns number of comments deleted
 */
async function deleteComments(commentIds) {
    let deleteRes = await Comment.deleteMany({ _id: { $in: commentIds }});
    return deleteRes.deletedCount;
}

/**
 * Given an array of tag ObjectIds, deletes all the tags.
 * @param answerIds array of ObjectIds
 * @returns number of tags deleted
 */
async function deleteTags(tagIds) {
    let tags = await Tag.find({ _id: { $in: tagIds }});

    //Delete all tags from user and questions
    let update = { $pullAll: { tags: tagIds }};
    let query = { tags: { $elemMatch: { $in: tagIds }}};
    await User.updateMany(query, update);
    await Question.updateMany(query, update);
    await Tag.deleteMany({ _id: { $in: tagIds }});
    return tags.length;
}

/**
 * Check if giving tag is using by other users.
 * @param user user that current using the tag
 * @param tag tag that needs to be checked 
 * @returns true if tag is using by other users false otherwise
 */
async function checkTag(tag,user){
    let result = false; 
    await Question.find({tags: tag._id}).then((questions)=>{
        questions.forEach((question)=>{
            if(!question.asked_by.equals(user._id)){
                result =  true; 
            }
        })
    })
    return result;   
}
async function getAndCreateTags(tagNames, asked_by) {
    let tags = [];
    let newTagNames = [];
    for (let i = 0; i < tagNames.length; i ++) {
        let queryResult = await Tag.findOne({ name: tagNames[i] });
        //If a tag exists, push its id. Otherwise, add it to the name of tags to be registered.
        if (queryResult)
            tags.push(queryResult._id)
        else
            newTagNames.push(tagNames[i]);   
    }
    //Create new tags
    if (newTagNames.length !== 0) {
        let insertRes = await Tag.collection.insertMany(newTagNames.map(tagName => new Tag({ name: tagName })));
        let newTags = []
        for (let i = 0; i < newTagNames.length; i ++) {
            newTags.push(insertRes.insertedIds[i]);
        }
        await User.findByIdAndUpdate(asked_by, { $addToSet: { tags: newTags }});
        tags.push(...newTags);
    }
    return tags;
}

/**
 * Delete user information using user id.
 * @param userId userid proivded 
 * @returns return back the userId
 */
async function deleteUser(userId){
    let userOne = await User.find({_id: userId});
    userOne = userOne[0]; 
    //get all the questions, answers,tags Id.
    let questionIds = [];
    let answerIds = [];
    let tagIds    = []; 
    let commentIds = [];
    questionIds.push(...userOne.questions);
    answerIds.push(...userOne.answers); 
    tagIds.push(...userOne.tags);
    //delete assoiscate quesions,answers,tags
    let delcom= []
    delcom =await Comment.find({user:userOne._id});

    await deleteQuestions(questionIds);
    await deleteAnswers(answerIds);
    // // for tags if only this user currently own the tag, then it can be delete or do nothing
    // for(let i=0; i <tagIds.length; ++i){
    //     let usercount = 0 ;
    //     let tagId = [];
    //     usercount =await User.find({tags:tagIds[i]})
    //     if(usercount.length ===1){
    //         tagId.push(tagIds[i]);
    //         await deleteTags(tagId)
    //     }
    // } 
    await deleteTags(tagIds);
    //delete comment 
    // let delcom= [];
    // delcom =await Comment.find({user:userOne._id});
    delcom.forEach((com)=>{
            commentIds.push(com._id); 
        })
    await deleteComments(commentIds);
    await User.deleteMany({_id: userId})
    return userId 
}

module.exports = {deleteUser,getAndCreateTags, checkTag, basicUserInfo, detailedUserInfo, sortQuestions, deleteQuestions, deleteAnswers, deleteComments, deleteTags };