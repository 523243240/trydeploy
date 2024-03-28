import { useState } from "react"
import { getDateString } from "../utils";
import { updateComment } from "../client";

export default function Comment({ comment, user, handleError }) {
    const [render, setRender] = useState(true);
    function incrementVote() {
        comment.votes += 1;
        setRender(!render);
        updateComment(comment, { votes: comment.votes }).catch((err) => {
            handleError(err);
        });    
    }

    return (
        <div className="Comment"> 
            <div className="CommentVotes"> {comment.votes} </div>
            {user !== undefined && <button className="CommentVoteButton" onClick={incrementVote}> ^ </button>}
            <span className="CommentText"> {comment.text}  </span>
            <span className="CommentUser"> {` - ${comment.user.username}`} </span>
            <span className="CommentDate"> {` ${getDateString(new Date(comment.dateCommented))}`} </span> 
        </div>
    )
}

