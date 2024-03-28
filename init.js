//Setup database with initial test data.
// Include an admin user.
// Script should take admin credentials as arguments as described in the requirements doc.

let userArgs = process.argv.slice(2);

if (userArgs.length >= 2) {
    let adminUsername = userArgs[0];
    let adminPassword = userArgs[1];

    let Tag = require('./models/tags');
    let Answer = require('./models/answers');
    let Question = require('./models/questions');
    let User = require('./models/users');
    let Comment = require('./models/comments');


    let mongoose = require('mongoose');
    let bcrypt = require('bcrypt');
    let mongoDB = "mongodb://127.0.0.1:27017/fake_so";
    mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

    // mongoose.Promise = global.Promise;
    let db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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

    function createComment({ text, user, dateCommented, votes, comments }) {
        let commentDetails = {
            text: text,
            user: user
        };
        if (dateCommented) commentDetails.dateCommented = dateCommented;
        if (votes) commentDetails.votes = votes;
        if (comments) commentDetails.comments = comments;
      
        let comment = new Comment(commentDetails);
        return comment.save();
    }

    function createTag({ name }) {
        let tag = new Tag({ name: name.toLowerCase() });
        return tag.save();
    }
    

    function createAnswer({ text, ans_by, ans_date_time, votes, comments }) {
        let answerDetails = {
            text: text,
            ans_by: ans_by
        };
        if (ans_date_time) answerDetails.ans_date_time = ans_date_time;
        if (votes) answerDetails.votes = votes;
        if (comments) answerDetails.comments = comments;
      
        let answer = new Answer(answerDetails);
        return answer.save();
    }

    function createQuestion({ title, summary, text, tags, asked_by, answers, ask_date_time, views, votes, comments }) {
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
        return question.save();
    }

    const populate = async () => {
        let admin = await createUser({ username: adminUsername, password: adminPassword, email: 'admin@gmail.com', isAdmin: true, reputation: 50 });
        let jojiJohn = await createUser({ username: 'Joji John', password: 'jj', email: 'jojijohn@gmail.com', reputation: 50 });
        let saltyPeter = await createUser( { username: 'saltyPeter', password: "sp", email: 'saltypeter@gmail.com', reputation: 50});
        let hamkalo = await createUser( { username: 'hamkalo', password: "ho", email: 'hamkalo@gmail.com', reputation: 50});
        let azad = await createUser( { username: 'azad', password: "ad", email: 'azad@gmail.com'});
        let abaya = await createUser( { username: 'abaya', password: "aa", email: 'abaya@gmail.com'});
        let alia = await createUser( { username: 'alia', password: "al", email: 'alia@gmail.com'});
        let sana = await createUser( { username: 'sana', password: "sa", email: 'sana@gmail.com'});
        let t1 = await createTag({ name: 'react' });
        let t2 = await createTag({ name: 'javascript' });
        let t3 = await createTag({ name: 'android-studio' });
        let t4 = await createTag({ name: 'shared-preferences' });
        let t5 = await createTag({ name: 'java' });
        let t6 = await createTag({ name: 'filler'});
        
        let a11 = await createAnswer({ text: 'This is the last filler answer', ans_by: admin });
        let a10 = await createAnswer({ text: 'This is the second to last filler answer', ans_by: admin });
        let a9 = await createAnswer({ text: 'This is another filler answer', ans_by: admin });
        let a8 = await createAnswer({ text: 'This is a filler answer', ans_by: admin });
        let a1 = await createAnswer({ text: 'React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', ans_by: hamkalo });
        let a2 = await createAnswer({ text: 'On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', ans_by: azad });
        let a3 = await createAnswer({ text: 'Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', ans_by: abaya });
        let a4 = await createAnswer({ text: 'YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', ans_by: alia });
        let a5 = await createAnswer({ text: 'I just found all the above examples just too confusing, so I wrote my own. ', ans_by: sana });
        let a6 = await createAnswer({ text: "Each object in java has a reference count associated with it.  When this count hits 0, it will be garbage collected", ans_by: jojiJohn});
        let a7 = await createAnswer({ text: "To expand on Joji's point, when you first use new to instaniate an object and its assigned a reference, the reference counter is 1.  However, when the reference goes out of scope, the reference counter is subtracted by one. In the other case, when you assign the reference to another variable, the reference counter will increment", ans_by: saltyPeter});
        hamkalo.answers.push(a1._id);
        azad.answers.push(a2._id);
        abaya.answers.push(a3._id);
        alia.answers.push(a4._id);
        sana.answers.push(a5._id);
        jojiJohn.answers.push(a6._id);
        saltyPeter.answers.push(a7._id);
        admin.answers.push(a8._id, a9._id, a10._id, a11._id);
        
        let q6 = await createQuestion({ title: 'Filler question 3', summary: "This is the last filler question", text: 'How was your day?', tags: [t6], answers: [], asked_by: admin });
        let q5 = await createQuestion({ title: 'Filler question 2', summary: "This is another filler question", text: 'How was your day?', tags: [t6], answers: [], asked_by: admin });
        let q4 = await createQuestion({ title: 'Filler question', summary: "This is a filler question", text: 'How was your day?', tags: [t6], answers: [], asked_by: admin });
        let q3 = await createQuestion({ title: 'Question about java', summary: "Question about java's garbage collection", text: 'How does the garbage collector know when to delete an object?', tags: [t5], answers: [a6, a7], asked_by: hamkalo });
        let q2 = await createQuestion({ title: 'android studio save string shared preference', summary: 'android studio save string shared preference, start activity and load the saved string', text: 'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.', tags: [t3, t4, t2], answers: [a3, a4, a5], asked_by: saltyPeter, views: 121 });
        let q1 = await createQuestion({ title: 'Programmatically navigate using React router', summary: 'Programmatically navigate using React router', text: 'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.', tags: [t1, t2], answers: [a1, a2, a8, a9, a10, a11], asked_by: jojiJohn });
        
        jojiJohn.questions.push(q1._id);
        jojiJohn.tags.push(t1._id, t2._id);
        saltyPeter.questions.push(q2._id);
        saltyPeter.tags.push(t3._id, t4._id);
        hamkalo.questions.push(q3._id);
        hamkalo.tags.push(t5._id);
        admin.questions.push(q4._id, q5._id, q6._id);
        admin.tags.push(t6._id);

        let c11 = await createComment({ text: "This is the last filler comment", user: admin });
        let c10 = await createComment({ text: "This is another filler comment", user: admin });
        let c9 = await createComment({ text: "This is a filler comment", user: admin });

        let c1 = await createComment({ text: "This is a comment", user: jojiJohn });
        let c2 = await createComment({ text: "Another comment @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@", user: saltyPeter});
        let c3 = await createComment({ text: "Much wow", user: jojiJohn });
        let c4 = await createComment({ text: "I agree", user: saltyPeter});

        let c5 = await createComment({ text: "I think you're right", user: jojiJohn });
        let c6 = await createComment({ text: "Thanks", user: jojiJohn});
        let c7 = await createComment({ text: "I get it now", user: saltyPeter });
        let c8 = await createComment({ text: "Ok", user: saltyPeter});
        
        q1.comments.push(c1._id, c2._id, c3._id, c4._id);

        a1.comments.push(c5._id);
        a2.comments.push(c6._id, c9._id, c10._id, c11._id);
        a3.comments.push(c7._id);
        a4.comments.push(c8._id);

        await q1.save();

        await a1.save();
        await a2.save();
        await a3.save();
        await a4.save();

        await hamkalo.save();
        await azad.save();
        await abaya.save();
        await alia.save();
        await sana.save();
        await jojiJohn.save();
        await saltyPeter.save();
        await admin.save();
        
        if(db) db.close();
        console.log('done');
    }

    populate()
    .catch((err) => {
        console.log('ERROR: ' + err);
        if(db) db.close();
    });

    console.log('processing ...');

}
