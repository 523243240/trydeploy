import { useEffect, useState } from "react";
import { getDateString } from "../utils"
import CommentList from "./CommentList";
import Tag from "./Tag";
import VoteButtons from "./VoteButtons";

/**
 * Component displaying the text and metadata of a question in answer page.
 * @param {object} props Component props.
 * @param {Question} props.question Reference to the question the component will display.
 */
export default function QuestionBody({question, onTagClick, user, handleError=()=>{}}) {
    const [votes, setVotes] = useState(0);
    const tagButtons = question.tags.map(tag => ( 
        <Tag key={question._id + "" + tag._id} className="QTag" onTagClick={onTagClick} tagName={tag.name}/>
    ));

    useEffect(() => {
        setVotes(question.votes);
    }, [question]);

    return (
        <>
            <div className="AQuestionContainer">
                <div className="AQuestionBody">
                    <div className="ABodyInfo"> 
                        <div> {question.views + ((question.views === 1) ? " view" : " views")} </div>
                        <div> {votes + ((votes === 1) ? " vote" : " votes")} </div>
                        { user !== undefined && <VoteButtons user={user} context={question} setVotes={setVotes} handleError={handleError}/> }
                    </div>
                    <div className="AQuestionText"> 
                        <p dangerouslySetInnerHTML={{__html:question.text}}></p>
                        <div className="ATags">
                            {tagButtons}
                        </div>
                    </div>
                    <div className="AAskData">
                        <div className="QUser">{question.asked_by.username} </div> 
                        <span className="QTime"> {" asked " + getDateString(new Date(question.ask_date_time))} </span>
                    </div> 
                </div>
                <CommentList question={question} user={user} handleError={handleError}/>
            </div>
        </>
    )
}


