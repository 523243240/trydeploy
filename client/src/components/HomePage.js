import HomePageHeader from './HomePageHeader.js';
import QuestionList from './QuestionList.js';

/**
 * Home page displaying the list of questions.
 * @param {Question} props.questions Array of questions objects to be displayed.
 * @param {String} props.title Title of the home page header.
 * @param {Function} props.toAnswerPage Function to go to answer page(Used when a question is pressed).
 * @param {Function} props.toAskQuestionPage Function to go to ask question page(Used when ask question button is pressed).
 * @param {Function} props.onNewestClick Function to handle newest filter button click.
 * @param {Function} props.onActiveClick Function to handle active filter button click.
 * @param {Function} props.onUnansweredClick Function to handle unanswered filter button click.
 * @param {Function} props.onTagClick Function to handle tag click within the question list.
 */
export default function HomePage({user, questions, title="All Questions", toAnswerPage=()=>{}, toAskQuestionPage=()=>{}, onNewestClick=()=>{}, onActiveClick=()=>{}, onUnansweredClick=()=>{}, onTagClick=()=>{}, handleError=()=>{}}) {
    return (
        <>
            <HomePageHeader user={user} toAskQuestionPage={toAskQuestionPage} onNewestClick={onNewestClick} onActiveClick={onActiveClick} onUnansweredClick={onUnansweredClick} questionCount={questions.length} title={title} />
            {questions.length !== 0 && <QuestionList toAnswerPage={toAnswerPage} questions={questions} onTagClick={onTagClick} handleError={handleError}/>}
            {questions.length === 0 && <div id="NoQuestionsFound"> No Questions Found </div>}
        </>
    );
}
