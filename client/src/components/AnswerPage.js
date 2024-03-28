import QuestionHeader from "./QuestionHeader";
import QuestionBody from "./QuestionBody";
import AnswerList from "./AnswerList";


/**
 * Page displaying the question and its answers.
 * @param {object} props Component props.
 * @param {Model} props.model Reference to the model.
 * @param {Question} props.question Reference to the question the page will display.
 * @param {Function} props.toAskQuestionPage Function to go to ask question page(Used when ask question button is pressed).
 * @param {Function} props.toNewAnswerPage Function to go to new answer page(Used when answer question button is pressed).
 */
export default function AnswerPage({toEditAnswer, allowEdit,question, toAskQuestionPage, toNewAnswerPage, onTagClick, user, handleError=()=>{}}) {
    return (
        <>
            <QuestionHeader user={user} toAskQuestionPage={toAskQuestionPage} question={question}/>
            <QuestionBody question={question} onTagClick={onTagClick} user={user} handleError={handleError}/>
            <AnswerList question={question} toEditAnswer={toEditAnswer} allowEdit={allowEdit} answers={question.answers} user={user} handleError={handleError}/>
            { (user !== undefined && allowEdit === false) && <button id="ansQuestion" onClick={() => toNewAnswerPage(question)}> Answer Question </button>}
        </>
    );
}