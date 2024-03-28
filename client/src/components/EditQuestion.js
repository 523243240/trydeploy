import { updateQuestion, deleteQuestion, getAllTags, getUser } from '../client.js';

export default function EditQuestion({toProfile=()=>{}, handleError=()=>{}, user, question}){
    return (
        <div className="AskBody" id="AskBody">
            <h1>Edit Question</h1>
            <h1>Question Title*</h1>
            <p>Limit title to 50 character or less</p>
            <input id = "QesTitle" className="QesTitle" defaultValue = {question.title}/>
            <p className="inputErrorMsg" id="qTitleError"></p>

            <h1>Question Summary*</h1>
            <p>Limit summary to 140 characters or less</p>
            <textarea placeholder="Please enter the summary of your question"
            id="QuestionSummary" className="QuestionSummary" defaultValue={question.summary}> 
            </textarea>
            <p className="inputErrorMsg" id="qSummaryError"></p>

            <h1>Question Text*</h1>
            <p>Add details</p>
            <textarea placeholder="Please enter the detail of your question"
            id="QuestionDetail" className="QuestionDetail" defaultValue={question.text}> 
            </textarea>
            <p className="inputErrorMsg" id="qDetailError"></p>

            <h1>Tags*</h1>
            <p>Add key words separated by whitespace</p>
            <input placeholder="enter tag here" id ="tagsInput" defaultValue={question.tags.map(tag => tag.name).join(" ")}/>
            <p className="inputErrorMsg" id="qTagsError"></p>

            <button type="button" className="PostQuestion" id="EditQuestion" onClick={EditQuestion}>Edit Question</button>
            <button type="button" className="PostQuestion" id="DeleteQuestion" onClick={DeleteQuestion} style={{width: "150px"}}>Delete Question</button>

            <span id="indMandatory">* indicates mandatory fields</span>
        </div>
    );
    async function EditQuestion(){
        try {
            let title = document.getElementById("QesTitle").value.trim(); 
            let text  = document.getElementById("QuestionDetail").value.trim(); 
            let summary = document.getElementById("QuestionSummary").value.trim();
            let tagNames = document.getElementById("tagsInput").value.trim().split(/\s+/);
            let err = false; 

            document.getElementById("qTitleError").textContent = "";
            document.getElementById("qSummaryError").textContent = "";
            document.getElementById("qDetailError").textContent = "";
            document.getElementById("qTagsError").textContent = "";

            let allTags = (await getAllTags()).data;
            if(tagNames.length === 0 || tagNames[0] === ""){
                document.getElementById("qTagsError").textContent = "Input at least 1 tag.";
                err = true;
            }
            //tag length more than 5 
            if(tagNames.length > 5){
                document.getElementById("qTagsError").textContent = "Can't have more than 5 tags.";
                err = true; 
            }
            else {
                //tags format weren't right 
                for(let i =0; i < tagNames.length; i++){
                    if(allTags.filter((tag) => tag.name === tagNames[i]).length === 0 && tagNames[i].length >10){
                        document.getElementById("qTagsError").textContent = "Invalid tag. New tags can't have more than 10 characters."
                        err = true; 
                    }
                }           
                let userData = (await getUser(user)).data;
                //If tag formats are valid, check if the user is able to create new tags. If not, make sure that all tags already exist
                if (!err && userData.reputation < 50 && !userData.isAdmin) {
                    if (allTags.filter((tag) => tagNames.includes(tag.name)).length !== tagNames.length) {
                        document.getElementById("qTagsError").textContent = "You must have at least 50 reputation to create a new tag."
                        err = true; 
                    }
                }
            }

            //empty text enter 
            //if no title enter 
            if(title.length === 0){
                document.getElementById("qTitleError").textContent = "Please enter a title.";
                err = true; 
            }
            //if title exceeds 50 characters
            else if(title.length > 50){
                document.getElementById("qTitleError").textContent = "Title exceeds character limit.";
                err = true; 
            }

            if (summary.length === 0) {
                document.getElementById("qSummaryError").textContent = "Please enter a summary.";
                err = true;
            }
            else if (summary.length > 140) {
                document.getElementById("qSummaryError").textContent = "Summary exceeds character limit.";
                err = true; 
            }
        
            //no question detail 
            if(text.length === 0 || text === " "){
                document.getElementById("qDetailError").textContent = "Please enter question text.";
                err = true; 
            }
            if(!err) {
                await updateQuestion(question, {title: title, tagNames: tagNames, summary: summary, text: text})
                toProfile();
            }
        }
        catch (error) {
            handleError(error);
        }
    }

    async function DeleteQuestion(){
        try {
            await deleteQuestion(question); 
            return toProfile();
        }
        catch (error) {
            handleError(error);
        }
    }
}