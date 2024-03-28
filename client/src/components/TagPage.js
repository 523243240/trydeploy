import TagPageHeader from "./TagPageHeader"
export default function TagsPage({toEditTag=()=>{}, allowEdit=false, user, tags, title="All Tags", toAskQuestionPage=()=>{}, onTagClick=()=>{}, questions}){
    let tagQuestionCounts = tags.map((tag) => getTagQuestionCount(tag));

    /**
     * Generates the list of tag elements to be displayed in the tag page.
     */ 
    return(
        <>
            <TagPageHeader user={user} toAskQuestionPage={toAskQuestionPage} tagCount = {tags.length} title={title} />
            {tags.map(  (tag, i) => {
                    return (
                         <div key={tag.id} className="tag_display" >
                            <a className="tag_name" onClick={()=>{ onTagClick(tag.name) }}>{tag.name}</a>
                            <p>{tagQuestionCounts[i] + ((tagQuestionCounts[i] === 1) ? " question" : " questions")} </p>
                            <div>
                                {(allowEdit && (<button onClick={()=>toEditTag(tag)} >edit/delete</button>))}
                                
                            </div>
                        </div>
                    );
                    
                }
            )}  
        </>
    )

    function getTagQuestionCount(tag){
        let count = 0;
        for(let i = 0; i < questions.length; i++)
          for(let j = 0; j < questions[i].tags.length; j++){
            if(questions[i].tags[j]._id === tag._id){
              count++;
            }
          } 
        return count;
     }
    
}




