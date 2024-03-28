import { useState, useEffect } from 'react';
import { getDateString } from "../utils";
import CommentList from "./CommentList";
import VoteButtons from './VoteButtons';

/**
 * Component displaying an answer in an answer list.
 * @param {object} props Component props.
 * @param {Answer} props.answer Answer to display.
 */
export default function Answer({answer, user, handleError=()=>{}}) {
    const [votes, setVotes] = useState(0);

    useEffect(() => {
        setVotes(answer.votes);
    }, [answer])

    return (
        <div className="AnswerContainer">
            <div className="Answer">
                <div className="AVotesContainer">
                    <div> {`${votes} ${(votes === 1) ? " vote" : " votes"}`} </div>
                    { user !== undefined && <VoteButtons user={user} context={answer} handleError={handleError} setVotes={setVotes}/>}
                </div>
                <div className="AText">
                    <p dangerouslySetInnerHTML={{__html:answer.text}}></p>
                    
                </div>

                <div className="AData">
                    <span className="AUser">{answer.ans_by.username}</span>
                    <span className="ATime">{" answered " + getDateString(new Date(answer.ans_date_time))}</span>
                </div>
                
            </div>
            <CommentList answer={answer} user={user} handleError={handleError}/>
        </div>
    );
}



// " asked " + getDateString(new Date(question.ask_date_time))