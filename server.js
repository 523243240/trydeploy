// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.

const mongoose = require('mongoose');
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const app = express();
const port = process.env.PORT||8000;
const mongoDB = 'mongodb://127.0.0.1:27017/fake_so';
const path = require ("path")
//Use environment variables from .env
require('dotenv').config();

//Allow for localhost:3000 to connect
app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true, //Allow for cookies
    optionsSuccessStatus: 200
}));
app.use(express.static(path.join(__dirname,"client", "build")))
app.get("*",(req,res)=>{
  res.sendFile((path.join(__dirname,"client/public","build","index.html")))
})

//Routers
const questionsRouter = require('./routers/questionsRouter');
const answersRouter = require('./routers/answersRouter');
const tagsRouter = require('./routers/tagsRouter');
const usersRouter = require('./routers/usersRouter');
const loginRouter = require('./routers/loginRouter');
const commentsRouter = require('./routers/commentsRouter');

//Middleware
const errorHandler = require('./middleware/errorHandler');


//Connect to mongoose
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
console.log("Connected to MongoDB");

//Start the server application
app.listen(port, () => console.log(`app listening to port ${port}`));

process.on('SIGINT', () => {
  if (db) {
    db.close();
    console.log("Shutting Down Server...");
  }
});

//Use express's json middleware
app.use(express.json());

//Use sessions
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      cookie: { maxAge: 900000 }, //15 minute sessions
      resave: false,
      saveUninitialized: false
    })
);

//Use our routers
app.use('/posts/question', questionsRouter);
app.use('/posts/answer', answersRouter);
app.use('/posts/tag', tagsRouter);
app.use('/posts/comment', commentsRouter);
app.use('/user', usersRouter);
app.use('/', loginRouter);

//Use error handling middleware
app.use(errorHandler);


