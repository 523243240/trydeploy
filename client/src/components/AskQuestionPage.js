import { getUser } from "../client"
import hyperLink from "./hyperLink";
export default function AskQuestionPage({user, handleError=()=>{}, toHomePage, allTags, postQuestion}) {
    async function Post(){
        let title = document.getElementById("QesTitle").value.trim();
        let text = document.getElementById("QuestionDetail").value.trim();
        let tagNames = document.getElementById("tagsInput").value.trim().split(/\s+/);
        let summary = document.getElementById("QuestionSummary").value.trim();
        let err = false;
        let link = ''; 

        document.getElementById("qTagsError").textContent = "";
        document.getElementById("qTitleError").textContent = "";
        document.getElementById("qSummaryError").textContent = "";
        document.getElementById("qDetailError").textContent = "";
    
        try {

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
            else {
                link = hyperLink(text)

                if(link){
                    //no empty string is return, add link to text 
                    text = link; 
                }
                else{
                    document.getElementById("qDetailError").textContent = "HyperLink you enter has error please check";
                    err = true; 
                }
            }

            //No error at all 
            if(!err){
                await postQuestion({ title: title, summary: summary, text: text, tagNames: tagNames, asked_by: user._id });
                toHomePage();            
            }
        }
        catch (err) {
            handleError(err);
        }
    }

    return (
            <div className="AskBody" id="AskBody">
                <h1>Question Title*</h1>
                <p>Limit title to 50 character or less</p>
                <input id = "QesTitle" className="QesTitle" placeholder="Please enter your question title here" />
                <p className="inputErrorMsg" id="qTitleError"></p>

                <h1>Question Summary*</h1>
                <p>Limit summary to 140 characters or less</p>
                <textarea placeholder="Please enter the summary of your question"
                id="QuestionSummary" className="QuestionSummary" defaultValue=""> 
                </textarea>
                <p className="inputErrorMsg" id="qSummaryError"></p>

                <h1>Question Text*</h1>
                <textarea placeholder="Please enter the detail of your question"
                id="QuestionDetail" className="QuestionDetail" defaultValue=""> 
                </textarea>
                <p className="inputErrorMsg" id="qDetailError"></p>

                <h1>Tags*</h1>
                <p>Add key words separated by whitespace</p>
                <input placeholder="enter tag here" id ="tagsInput"/>
                <p className="inputErrorMsg" id="qTagsError"></p>

                <br/><br/>
                <button type="button" className="PostQuestion" id="PostQuestion" onClick={Post}>Post Question</button>
                <span id="indMandatory">* indicates mandatory fields</span>
            </div>
    );
}