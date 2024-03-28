

/**
 * Component representing the ask question button.
 * @param {object} props Component props.
 * @param {Function} props.toAskQuestionPage Function to go to ask question page.
 */
export default function AskQuestionButton({user, toAskQuestionPage}) {
    return (<>
        {user !== undefined && <button className="AskQuestion" onClick={() =>{toAskQuestionPage()}}>{"Ask Question"}</button>}
        </>
    );
}