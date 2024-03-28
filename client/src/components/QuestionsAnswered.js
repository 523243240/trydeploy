import QuestionList from "./QuestionList"

export default function QuestionsAnswered({ user, handleError, questions, toAnswers, onTagClick}){
    return(
        <div className={"QuestionsAnswered"}>
          <h1> {"Questions you've answered"} </h1>
          <QuestionList user={user} showProfile={true} handleError={handleError} questions={questions} toAnswerPage={toAnswers} onTagClick={onTagClick}/>
          { questions.length === 0 && <div id="NoQuestionsFound">{"You haven't answered any questions yet"}</div>}
        </div>
    )
}