import hyperLink from "./hyperLink";
import { updateAnswer,deleteAnswer } from "../client";

export default function EditAnswer({answer,question,toAnswers=()=>{}, handleError=()=>{} }){
    return(
        <div className="new_answer_page" id="new_answer_page">
            <h1>Answer Text*</h1>
            <textarea className="QuestionDetail" id="ansText" defaultValue={answer.text}>
            </textarea>
            <p className="inputErrorMsg" id="aAnswerTextError"></p>
            <br/><br/>

            <button className="PostQuestion" id="PostAnswer" onClick={addAnswer}>Post Answer</button>
            <button className="PostQuestion" id="DeleteAnswer" onClick={deleteAns}>Delete Answer</button>
            <span id="indMandatory">* indicates mandatory</span>
        </div>
    )

    async function addAnswer(){
        let ansText = document.getElementById("ansText").value.trim();
        let err = false;
        let link = '';
        document.getElementById("aAnswerTextError").textContent = "";

        if (ansText.length === 0) {
            document.getElementById("aAnswerTextError").innerHTML = "Please enter answer text.";
            err = true;
        }
        else {
            link = hyperLink(ansText); 
            if(link){
                //no empty is return, add link to text 
                ansText = link; 
            }
            else{
                document.getElementById("aAnswerTextError").innerHTML = 
                "HyperLink in your answer section is not formatting right. Please fix it."
                err = true;
            }
        }

        if (!err) {
            try {
                await updateAnswer(answer, ansText);
                toAnswers(question);
            }
            catch (err) {
                handleError(err);
            }
        }
    }

    async function deleteAns(){
        try{
            await deleteAnswer(answer);
            toAnswers(question);
        }
        catch(err){
            handleError(err);
        }
        
    }

 }