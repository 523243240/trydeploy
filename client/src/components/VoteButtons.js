import { useState } from "react";
import { upvote, downvote, getUser } from "../client";


export default function VoteButtons({ user, context, setVotes=()=>{}, handleError=()=>{} }) {
    const [errorMessage, setErrorMessage] = useState("");
    async function handleUpvote() {
        try {
            let userData = (await getUser(user)).data;
            if (userData.reputation >= 50 || userData.isAdmin) {
                let res = await upvote(context);
                setVotes(res.data.votes);
            }
            else {
                setErrorMessage("You must have at least 50 reputation to vote!");
            }
        }
        catch (err) {
            handleError(err);
        }
    }

    async function handleDownvote() {
        try {
            let userData = (await getUser(user)).data;
            if (userData.reputation >= 50 || userData.isAdmin) {
                let res = await downvote(context);
                setVotes(res.data.votes);
            }
            else {
                setErrorMessage("You must have at least 50 reputation to vote!");
            }
        }
        catch (err) {
            handleError(err);
        }
    }
    
    return (
        <div>
            <button onClick={handleUpvote} className="VoteButton"> ^ </button>
            <button onClick={handleDownvote} className="VoteButton Downvote"> ^ </button>
            <p className="VoteErrorMessage"> {errorMessage} </p>
        </div>
    );
}