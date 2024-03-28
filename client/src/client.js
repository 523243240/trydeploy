import axios from 'axios';

const client = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: true
});

/**
 * Posts a new question. (Assumes that input is valid bc new tags are created before validation)
 * @param question.title title of the question. (Required field)
 * @param question.summary summary of the question (Required field)
 * @param question.text text of the question. (Required field)
 * @param question.tagNames array of tag names. (Required field)
 * @param question.answers array of Answer ObjectIds. (Default [])
 * @param question.asked_by User ObjectId of the user asking the question.
 * @returns promise to axios post response.
 */
export function postQuestion({ title, summary, text, tagNames, asked_by }) {
    return client.post('/posts/question/add', { title: title, summary: summary, text: text, tagNames: tagNames, asked_by: asked_by });
}

/**
 * Posts a new answer.
 * @param question the question object that this answer is for.
 * @param answer.text text of the answer. (Required field)
 * @param answer.ans_by username of the answerer. (Required field)
 * @returns promise to axios post response 
 */
export async function postAnswer(question, { text, ans_by }) {
    return client.post('/posts/answer/add', { question, text, ans_by });
}

/**
 * Posts a new user.
 * @param user username.(Required field)
 * @param email email address that user used to login (Required field)
 * @param password password created by user (Required field)
 * @returns promise to axios post response 
 */
export function postUser({user, password, email}){
    return client.post('/user/add',{ username: user, password: password, email: email });
}

/**
 * Posts a new comment to a question
 * @param question question this commment is for. (Required)
 * @param text text of the comment (Required)
 * @param user ObjectId of who commented (Required)
 * @returns promise to axios post response 
 */
export function postCommentToQuestion(question, { text, user }){
    return client.post('/posts/comment/add',{ question: question, text: text, user: user });
}

/**
 * Posts a new comment to an answer
 * @param answer answer this commment is for. (Required)
 * @param text text of the comment (Required)
 * @param user ObjectId of who commented (Required)
 * @returns promise to axios post response 
 */
export function postCommentToAnswer(answer, { text, user }){
    return client.post('/posts/comment/add',{ answer: answer, text: text, user: user });
}



/**
 * Updates the question.
 * @param question the question object to be updated
 * @param data object containing the updated question data
 * @param data.title title of the question.
 * @param data.text text of the question.
 * @param data.tags array of Tag ObjectIds
 * @param data.answers array of Answer ObjectIds.
 * @param data.asked_by username of the asker.
 * @param data.ask_date_time date the question was asked.
 * @param data.views number of views the question has.
 * @param question.comments array of Comment ObjectIds.
 * @returns promise to axios put response.
 */
export function updateQuestion(question, data){
    return client.put(question.url, data);
}

export function viewQuestion(question) {
    return client.get(`${question.url}/view`);
}

/** 
 * Updates the comment.
 * @param comment the comment object to be updated.
 * @param data object containing updated comment data
 * @param data.votes votes of the comment
 */
export function updateComment(comment, data) {
    return client.put(comment.url, data);
}

/**
 * Get all tags.
 * @returns promise to axios get response.
 */
export function getAllTags() {
    return client.get('/posts/tag/all');
}

/**
 * Get all questions.
 * @param sortBy a number (0, 1, 2) corresponding to (NEWEST, ACTIVE, UNANSWERED) a sorting method.
 * @returns promise to axios get response.
 */
export function getAllQuestions(sortBy = 0) {
    return client.get(`/posts/question/all?sortBy=${sortBy}`);
}
/** 
 * Gets a specific question from user.
 * @param questionId user proive question Id.
 * @returns promise to axios get response.
 */
//posts/question/${this._id}
export function getQuestionById(questionId) {
    return client.get(`/posts/question/${questionId}`);
}

/** 
 * Gets a specific question.
 * @param question question object to retreive.
 * @returns promise to axios get response.
 */
export function getQuestion(question) {
    return client.get(question.url);
}

/** 
 * Gets a specific comment.
 * @param comment comment object to retreive.
 * @returns promise to axios get response.
 */
export function getComment(comment) {
    return client.get(comment.url);
}


/** 
 * Gets a specific user.
 * @param user user object to retreive.
 * @returns promise to axios get response.
 */
export function getUser(user) {
    return client.get(user.url);
}

/**
 * Gets all questions of a specific user
 * @param user user object that the questions belong to
 * @returns promise to axios get response
 */
export function getUserQuestions(user) {
    return client.get(`/posts/question/all/${user._id}`);
}

/**
 * Gets all questions that the specified user has answered
 * @param user user object
 * @returns promise to axios response
 */
export function getUserQuestionsAnswered(user) {
    return client.get(`/posts/question/answered/${user._id}`);
}

/**
 * Gets all questions relevant to the search string.
 * @param searchString the search string from the search bar.
 * @returns promise to axios get response.
 */
export function searchQuestions(searchString) {
    let tokens = searchString.split(" ");
    let tags = []
    let words = []
  
    for (let i = 0; i < tokens.length; i ++)
    {
        if (tokens[i] === "")
            continue;
        if (tokens[i].match(/\[.+\]/)) //Is tag
            tags.push(tokens[i].substring(1, tokens[i].length - 1));
        else {
            words.push(tokens[i]);
        }
    }

    return client.get(`/posts/question/search?words=${words.join("+")}&tags=${tags.join("+")}`);
}

/**
 * Attempts to login using the inputted email and password. If the login credentials are invalid, there will be an error.
 * To catch the error you would do login(email, password).then(() => successfully login)).catch((err) => { <Display login error message to client> });
 * Or surround with try catch block if you do await login(email, password)
 * @param email email for the login
 * @param password password for the login
 * @returns promise to axios get response. If successful, returns the user object
 */
export function login(email, password) {
    return client.post('/login', { email: email, password: password });
}

/**
 * Logs the user out.
 * @returns promise to axios post response.
 */
export function logout() {
    return client.post('/logout');
}

/**
 * Check if user has session.
 * @returns promise to axios post response.
 */

export function checkSession() {
    return client.get('/session');
}

/**
 * Check if email_address repeat.
 * @returns promise to axios post response.
 */

export function checkEmail(email) {
    return client.post('/email',{email});
}

/**
 * delete a question.
 * @returns promise to axios delete response.
 */

export function deleteQuestion(question) {
    return client.delete(`/${question.url}`,);
}

/**
 * get single tag using tag id.
 * @returns promise to axios post response.
 */

export function getTag(tag) {
    return client.get(`posts/tag/${tag}`,);
}

/**
 * check tag use by other use .
 * @returns true if is use by other users, false otherwise.
 */

export function checkTagUse(tag,user) {
    let result = false; 
    return client.post("posts/tag/check",{tag:tag,user:user}).then((res)=>{
        if( res.data === ""){
            result = true; 
            return result; 
        }
        return result; 
            
    })
    // return client.put(`posts/tag/${tag._id}`,{name:tagName});
}
/**
 * update tag.
 * @returns promise to axios post response.
 */
export function updateTag(tag,tagName) {
    return  client.put(`posts/tag/${tag._id}`,{name:tagName});
    
}

/**
 * delete tag.
 * @returns promise to axios post response.
 */
export function deleteTag(tag){
    return client.delete(`/${tag.url}`)
}

/**
 * Upvotes a question or answer
 * @param context the question or answer to be upvoted 
 * @returns promise to axios response from put
 */
export function upvote(context) {
    return client.put(`${context.url}/add`, { votes: 1 });
}

/**
 * Downvotes a question or answer
 * @param context the question or answer being downvoted
 * @returns promise to axios response from put
 */
export function downvote(context) {
    return client.put(`${context.url}/add`, { votes: -1 });
}

/**
 * update answer.
 * @returns promise to axios post response.
 */

export function updateAnswer(answer,ansText){
    return client.put(`/${answer.url}`, {text:ansText})
}

/**
 * delete tag.
 * @returns promise to axios post response.
 */
export function deleteAnswer(answer){
    return client.delete(`/${answer.url}`)
}

/**
 * get all user.
 * @returns promise to axios post response.
 */
export function getAllUsers(){
    return client.get("/user/all")
}

/**
 * get specific user using user id .
 * @returns promise to axios post response.
 */
export function getUserById(userId){
    return client.get(`/user/${userId}`)
}

/**
 * delete specific user .
 * @returns promise to axios post response.
 */
export function deleteUser(userId){
    return client.delete(`/user/${userId}`)
}