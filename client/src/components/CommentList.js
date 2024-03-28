import { useState } from 'react';
import Comment from "./Comment";
import { getComment, getUser, postCommentToQuestion, postCommentToAnswer } from '../client';
import PageButtons from './PageButtons';


export default function CommentList({ question, answer, handleError=()=>{}, user }) {
    const [page, setPage] = useState(0);
    const [comment, setComment] = useState("");
    const [commentErrorMsg, setCommentErrorMsg] = useState("");

    let comments = [];
    if (question)
        comments = question.comments;
    else
        comments = answer.comments;
    let sortedComments = comments.sort((c1, c2) => new Date(c2.dateCommented) - new Date(c1.dateCommented))
    .filter((comment, i) => i >= page * 3 && i < (page + 1) * 3);

    function handleCommentInputChange(event) {
        if (commentErrorMsg !== "")
            setCommentErrorMsg("");
        setComment(event.target.value);
    }

    
    async function addComment() {
        let text = comment.trim();
        if (text.length > 140) {
            setCommentErrorMsg("Comments can't have more than 140 characters.");
            return;
        }
        if (text.length === 0) {
            setCommentErrorMsg("Please enter comment text if you wish to comment.");
            return;
        }
        try {
            let userData = (await getUser(user)).data;
            if (userData.reputation < 50 && !userData.isAdmin) {
                setCommentErrorMsg("You must have at least 50 reputation to add a comment.");
                return;
            }
            let res;
            let populatedComment;
            if (question) {
                res = await postCommentToQuestion(question, { text: text, user: user._id });
                populatedComment = (await getComment(res.data)).data;
                question.comments.push(populatedComment);
            }
            else {
                res = await postCommentToAnswer(answer, { text: text, user: user._id });
                populatedComment = (await getComment(res.data)).data;
                answer.comments.push(populatedComment);
            }
            
            setComment("");
        }
        catch (err) {
            handleError(err);
        }

    }

    //Only render the list when there are no comments if the user is logged in
    return ( <>
            { (comments.length !== 0 || user !== undefined) && <div className="CommentList">
                { sortedComments.map((comment, i) => <Comment key={i} comment={comment} user={user} handleError={handleError}/>)}
                { user !== undefined && <input type="text" placeholder="Add comment" className="CommentInput" value={comment} onChange={handleCommentInputChange}></input> }
                { user !== undefined && <button className={"CommentButton"} onClick={addComment}> Comment </button> }
                <div className={"CommentErrorMsg"}>{commentErrorMsg}</div>
                <PageButtons page={page} setPage={setPage} maxPerPage={3} totalItems={comments.length} />
            </div> }
        </>
    );
}
