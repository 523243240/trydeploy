import { useState, useEffect, useRef } from 'react';
import Banner from './Banner.js';
import Menu from './Menu.js'
import HomePage from './HomePage.js';
import AnswerPage from './AnswerPage.js';
import NewAnswerPage from './NewAnswerPage.js';
import AskQuestionPage from './AskQuestionPage.js';
import TagPage from './TagPage.js';
import Login from "./Login.js"
import CreateAccount from "./CreateAccount.js"
import  { getUser, getUserQuestions, postQuestion, postAnswer, getAllTags, getAllQuestions, searchQuestions, getQuestion, checkSession, logout,/*login*/
getAllUsers} from '../client.js';
import WelcomePage from './WelcomePage.js';
import ProfileUser from "./ProfileUser";
import ErrorMessage from './ErrorMessage.js';

const SORTBY = {
  NEWEST: 0,
  ACTIVE: 1,
  UNANSWERED: 2
}

export default function FakeStackOverflow() {
  //The current page that the website is displaying.
  const [page, setPage] = useState(<WelcomePage toHomePage={toHomePage} toLoginPage={toLoginPage} toCreateAccountPage={toCreateAccountPage}/>);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [user, setUser] = useState(undefined);
  //Flag whether or not to render the menu on the left side.
  const [showMenu, setShowMenu] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  //Reference to the user state
  const userRef = useRef(undefined)
  userRef.current = user;

  //Clear error message and update user data whenever we switch pages
  useEffect(() => {
    updateUser();
    setErrorMessage("");
  }, [page]);
  //On initial load, check if the user is already logged in.  If so, we send them directly to the homepage.
  useEffect(() => {
    checkSession().then((u) => { if (u.data) { setUser(u.data); toHomePage();} }).catch((err) => { 
      handleError(err);
    });
  }, []);

  //If a user's session has expired, bring them back to welcome page
  if (user)
    checkSession().then((u) => { if (!u.data) { setUser(undefined); handleSessionExpired(); }}).catch((err) => { 
      handleError(err);
    });

  /**************************************** Page Transition Functions ********************************************************/
  //Switches page to home page(When used for onClick it should be used as onClick=()=>{toHomePage(...)})
  async function toHomePage(sortBy = SORTBY.NEWEST, title="All Questions", searchString) {
    let response;
    try {
      if (searchString !== undefined)
        response = await searchQuestions(searchString);
      else
        response = await getAllQuestions(sortBy);
      setShowMenu(true);
      setSelectedMenu(0);
      setPage(<HomePage user={userRef.current} handleError={handleError} questions={response.data} title={title} toAskQuestionPage={toAskQuestionPage} toAnswerPage={toAnswerPage} onNewestClick={getFilterFunct(SORTBY.NEWEST)} onActiveClick={getFilterFunct(SORTBY.ACTIVE)} onUnansweredClick={getFilterFunct(SORTBY.UNANSWERED)} onTagClick={onTagClick} />);
    }
    catch (err) {
      handleError(err);
    }
    
  }
  //Switches page to answer page
  async function toAnswerPage(question) {
    try {
      question = (await getQuestion(question)).data; //Get the most recent version of this question
      setPage(<AnswerPage allowEdit={false} user={userRef.current} handleError={handleError} question={question} toAskQuestionPage={toAskQuestionPage} toNewAnswerPage={toNewAnswerPage} onTagClick={onTagClick} />);
      setShowMenu(true);
      setSelectedMenu(-1);
    }
    catch (err) {
      handleError(err);
    }
  }

  //Switches page to new answer page
  function toNewAnswerPage(question) {
    setPage(<NewAnswerPage user={userRef.current} handleError={handleError} question={question} postAnswer = {postAnswer} toAnswerPage={toAnswerPage}/>);
    setShowMenu(true);
    setSelectedMenu(-1);
  }

  //Switches page to tags page
  async function toTagsPage() {
    try {
      setSelectedMenu(1);
      let response;
      response = await getAllTags();
      let responseQes;
      responseQes = await getAllQuestions(); 
      setPage(<TagPage user={userRef.current} handleError={handleError} tags={response.data} title="All Tags" toAskQuestionPage={toAskQuestionPage} onTagClick={onTagClick} questions = {responseQes.data}/>);
      setShowMenu(true);
    }
    catch (err) {
      handleError(err);
    }
  }

  //Switch to ask question page
  async function toAskQuestionPage() {
    try {
      let response; 
      response = await getAllTags();
      //need all tags to compare if dupulicate tag exist
      let allTags = response.data;
      setPage(<AskQuestionPage user={userRef.current} handleError={handleError} toHomePage={toHomePage} allTags = {allTags} postQuestion={postQuestion}/>);
      setShowMenu(true);
      setSelectedMenu(-1);
    }
    catch (err) {
      handleError(err);
    }
  }

  //Switch to login page
  function toLoginPage() {
    setPage(<Login handleError={handleError} toCreateAccountPage={toCreateAccountPage} toHomePage={toHomePage} setUser={setUser}/>)
    setShowMenu(false);
  }

  //Switch to createAccount page
  function toCreateAccountPage() {
    setPage(<CreateAccount handleError={handleError} toLoginPage={toLoginPage}/>)
    setShowMenu(false)
  }

  //switch to welcome page 
  async function toWelcomePage(){
    setPage(<WelcomePage handleError={handleError} toHomePage={toHomePage} toLoginPage={toLoginPage} toCreateAccountPage={toCreateAccountPage}/>)
    setShowMenu(false);
  }
  //switch to ProfileUser page 
  async function toProfileUserPage(user = userRef.current){
    try { 
      user = (await getUser(user)).data;
      let questions = (await getUserQuestions(user)).data;
      let allUsers = [];
      if (user.isAdmin)
        allUsers = (await getAllUsers()).data;
      if (userRef.current) {
        setPage(<ProfileUser user={user} questions={questions} allUsers={allUsers} handleError={handleError} handleSessionExpired={handleSessionExpired} onTagClick={onTagClick} toAskQuestionPage={toAskQuestionPage} toProfileUserPage={toProfileUserPage}/>);
        setShowMenu(true);
        setSelectedMenu(-1);
      }
      else {
        handleSessionExpired();
      }
    }
    catch (err) {
      handleError(err);
    }
    
  }

  /******************************************************************************************************************************/

  /********************************************** Event Handlers ****************************************************************/
  //Returns a function for filter button depending by the passed in SORTBY parameter
  function getFilterFunct(sortBy) {
    return () => { toHomePage(sortBy) };
  }
  //Handles user enter key press for search bar.
  function onSearchKeyDown(e) {
    if (e.key === "Enter")
      toHomePage(undefined, "Search Results", e.target.value);
  }
  //Handles tag button click either from within question list or in tags page.
  function onTagClick(tag) {
    tag = "[" + tag + "]"; 
    toHomePage (undefined, "Questions tagged " + tag, tag) ;
   }
   async function handleLogout() {
    try {
      await logout();
      toWelcomePage();
      setUser(undefined);
    }
    catch (err) {
      handleError(err);
    }
   }
   function handleError(error) {
    console.log(error);
    if (error.code === "ERR_NETWORK")
      handleConnectionLost();
    else if (error.response && error.response.data === "InvalidSessionError")
      handleSessionExpired();
   }
   function handleConnectionLost() {
    setErrorMessage("Unable to connect to server.  ");
   }
   function handleSessionExpired() {
    toWelcomePage();
    setTimeout(() => {setErrorMessage("Your session has expired. Please login again.  ")}, 100);
   }
   function updateUser() {
    if (user)
      return getUser(user).then((updatedUser) => {setUser(() => updatedUser.data); return updatedUser.data; }).catch((err) => { handleError(err); });
   }
  /*******************************************************************************************************************************/
  return (
    <>
      <Banner user={userRef.current} handleError={handleError} toProfileUserPage={toProfileUserPage} toHomePage={toHomePage} onSearchKeyDown={onSearchKeyDown} toLoginPage={toLoginPage} toWelcomePage={toWelcomePage} handleLogout={handleLogout} />
      <ErrorMessage message={errorMessage} toWelcomePage={toWelcomePage}/>
      <div className="Body">
        {(showMenu && <Menu toHomePage={toHomePage} toTagsPage={toTagsPage} selectedMenu={selectedMenu}/>)}
        <div id="main">
          {page}
        </div>
      </div>
    </>
  );
  
}


