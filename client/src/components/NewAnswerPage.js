import hyperLink from "./hyperLink";

export default function NewAnswerPage({ user, question,postAnswer,toAnswerPage, handleError=()=>{} }){
    return(
        <div className="new_answer_page" id="new_answer_page">
            <h1>Answer Text*</h1>
            <textarea className="QuestionDetail" id="ansText" placeholder="Enter your answer here">
            </textarea>
            <p className="inputErrorMsg" id="aAnswerTextError"></p>
            <br/><br/>

            <button className="PostQuestion" id="PostAnswer" onClick={addAnswer}>Post Answer</button>
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
            const newAnswer = { text: ansText, ans_by: user._id };
            try {
                await postAnswer(question, newAnswer);
                toAnswerPage(question);
            }
            catch (err) {
                handleError(err);
            }
        }
    }

 }