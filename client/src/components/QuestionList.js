import { useEffect, useState } from "react";
import Question from "./Question.js"
import PageButtons from "./PageButtons.js";

/**
 * Component containing a list of questions.
 * @param {Question} props.questions Array of questions objects to be displayed.
 * @param {Function} props.onTagClick Function to handle a tag button click.
 * @param {Function} props.toAnswerPage Function to go to answer page(Used when a question is pressed).
 */
export default function QuestionList({toAnswerPage=()=>{}, onTagClick=()=>{}, questions, handleError=()=>{}}) {
    const [page, setPage] = useState(0);
    let displayedQuestions = questions.filter((q, i) => i >= page * 5 && i < (page + 1) * 5);

    //When question list changes reset the page
    useEffect(() => {
        setPage(0);
    }, [questions])

    return (
        <>
            <div className={"QuestionList"}>
                {displayedQuestions.map((question) => { 
                    return <Question key={question._id} toAnswerPage={toAnswerPage} onTagClick={onTagClick} question={question} handleError={handleError}/> 
                })}
            </div>
            <PageButtons page={page} setPage={setPage} maxPerPage={5} totalItems={questions.length} />
        </>
    );
}