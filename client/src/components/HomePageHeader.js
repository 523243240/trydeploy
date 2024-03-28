import AskQuestionButton from "./AskQuestionButton.js"

/**
 * Component that represents the header above the questions list.
 * @param {object} props Component props.
 * @param {number} props.questionCount Number of questions.
 * @param {String} props.title Title of the home page header.
 * @param {Function} props.toAskQuestionPage Function to go to ask question page(Used when ask question button is pressed).
 * @param {Function} props.onNewestClick Function to handle newest filter button click.
 * @param {Function} props.onActiveClick Function to handle active filter button click.
 * @param {Function} props.onUnansweredClick Function to handle unanswered filter button click.
 */
export default function HomePageHeader({user ,toAskQuestionPage=()=>{}, onNewestClick=()=>{}, onActiveClick=()=>{}, onUnansweredClick=()=>{}, questionCount, title="All Questions"}) {
    return (
        <div className="HomeHeader">
            <div>
                <h1>{title}</h1>
                <AskQuestionButton user={user} toAskQuestionPage={toAskQuestionPage}/>
            </div>
            <span>{questionCount + ((questionCount === 1) ? " question" : " questions")}</span>
            <div className="FilterButtons" >
                <button onClick={onNewestClick}>Newest</button>
                <button onClick={onActiveClick}>Active</button>
                <button onClick={onUnansweredClick}>Unanswered</button>
            </div>
        </div>
    );
   
}