import AskQuestionButton from "./AskQuestionButton"

/**
 * Component displaying the title and answer count of a question in answer page.
 * @param {object} props Component props.
 * @param {Question} props.question Reference to the question the component will display.
 * @param {Function} props.toAskQuestionPage Function to go to ask question page(Used when ask question button is pressed).
 */
export default function QuestionHeader({user, question, toAskQuestionPage}) {
    return (
        <div className="AQuestionHeader">
            <div className="AAnswerCounter">{question.answers.length + ((question.answers.length === 1) ? " answer" : " answers")}</div>
            <div className="ATitle">{question.title} </div>
            <AskQuestionButton user={user} toAskQuestionPage={toAskQuestionPage}/>
        </div>
    );
}