import { checkTagUse,updateTag,deleteTag } from "../client";
export default function EditTag({toTagsCreated,tag,user, handleError}){
    return (
    <div>
        <h1>Edit Tags*</h1>
            <input id ="tagInput" defaultValue={tag.name}/>
            <p className="inputErrorMsg" id="qTagsError" style={{marginLeft: "5%"}}></p>
            <button className="PostQuestion" onClick={()=>{changeTag(tag)} }>Edit</button> 
            <button className="PostQuestion" onClick={()=>{delTag(tag)}}>Delete</button>
    </div>
        )    
    
    async function changeTag(tag){
        let tagName = document.getElementById("tagInput").value.trim().split(/\s+/)
        let err = false; 
        if(tagName.length>1){
            document.getElementById("qTagsError").textContent = "Can only enter 1 tag or tag entered has space in between.";
            err = true; 
        }

        if(tagName[0].length >10){
            document.getElementById("qTagsError").textContent = "New Tag can't be more than 10 characters";
            err = true;
        }

        if(tagName[0].length === 0){
            document.getElementById("qTagsError").textContent = "Tag can't be empty";
            err = true; 
        }

        if(!err){     
            let result; 
            try {
                result = await checkTagUse(tag,user);
                if(result === true){
                    document.getElementById("qTagsError").textContent = "Tag use by other user too, you can't edit this tag";
                }
                else{
                    await updateTag(tag,tagName[0])
                    toTagsCreated();
                }
            }
            catch (err) {
                if (err.response && err.response.status === 409)
                    document.getElementById("qTagsError").textContent = "This tag name already exists!";
                else
                    handleError(err);
            }
            
        }

    }

    async function delTag(tag){
        try {
            let result = await checkTagUse(tag,user);
            if(result === true){
                document.getElementById("qTagsError").textContent = "Tag use by other user too, you can't delete this tag";
            }
            else{
                await deleteTag(tag); 
                toTagsCreated();
            }
        }
        catch (err) {
            handleError(err);
        }
        
    }

}