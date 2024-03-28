import AskQuestionButton from "./AskQuestionButton.js"

/**
 * Component that represents the header above the questions list.
 * @param {object} props Component props.
 * @param {number} props.questionCount Number of questions.
 * @param {String} props.title Title of the tag page header.
 * @param {Function} props.toAskQuestionPage Function to go to ask question page(Used when ask question button is pressed).
 */
export default function TagPageHeader({user, toAskQuestionPage=()=>{}, tagCount, title="All Tags"}) {
    return (
        <div className="tag_page" id="tag_page">
            <div className="tag_header">
                <ul>
                    <li>
                        <p id="tagCounter">
                        </p>
                        <span id="tagCounter">{tagCount + ((tagCount === 1) ? " tag" : " tags")}</span>
                    </li>
                    <li>
                        <p>{title}</p>
                    </li>
                    <li>
                        <AskQuestionButton user={user} toAskQuestionPage={toAskQuestionPage}/>
                    </li>
                </ul>
            </div>
        </div>
    );
}