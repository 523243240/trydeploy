import { useState } from "react";
import Answer from "./Answer";
import PageButtons from "./PageButtons";

/**
 * Component displaying a list of answers.
 * @param {object} props Component props.
 * @param {Answer[]} props.answers Array of answers to display.
 */
export default function AnswerList({question, toEditAnswer, allowEdit,answers, user, handleError=()=>{}}) {
    const [page, setPage] = useState(0);
    let sortedAnswers = answers.sort((a1, a2) => new Date(a2.ans_date_time) - new Date(a1.ans_date_time));
    //filte out user answer 
    let userAnswers = [];
    let otherAnswers = [];
    
    if (allowEdit) {
        for (let i = 0; i < sortedAnswers.length; i ++) {
            if (user._id === sortedAnswers[i].ans_by._id)
                userAnswers.push(sortedAnswers[i]);
            else
                otherAnswers.push(sortedAnswers[i]);
        }
        sortedAnswers = [...userAnswers, ...otherAnswers];
    }

    sortedAnswers = sortedAnswers.filter((answer, i) => i >= page * 5 && i < (page + 1) * 5);

    return (
        <>  
            <div className="AnswerList">
                {sortedAnswers.map((answer) => 
                    <div key={answer._id}>
                        <Answer answer={answer} user={user} handleError={handleError} />
                        { (allowEdit && answer.ans_by._id === user._id) && (<><button className="PostQuestion" onClick={()=>{toEditAnswer(answer,question)}} style={{marginTop: "20px"}} >Edit/Delete Answer</button> <hr/></>) }
                    </div>
                )}
            </div>
            <PageButtons page={page} setPage={setPage} maxPerPage={5} totalItems={answers.length} />
        </>
    );
}