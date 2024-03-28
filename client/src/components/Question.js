import { getDateString } from '../utils.js'
import { viewQuestion } from '../client.js';
import Tag from './Tag.js';

/**
 * Component displaying one question in question list.
 * @param {Question} props.question Question object to be displayed.
 * @param {Function} props.onTagClick Function to handle a tag button click.
 * @param {Function} props.toAnswerPage Function to go to answer page(Used when a question is pressed).
 */
export default function Question({toAnswerPage, onTagClick, question, handleError=()=>{}}) { 
    const tagButtons = question.tags.map(tag => ( 
        <Tag key={question._id + "" + tag._id} className="QTag" onTagClick={onTagClick} tagName={tag.name}/>
    ));
    return (
        <div className="Question">
            <div className="QStats">
                <div className="QStat">{question.answers.length + ((question.answers.length === 1) ? " answer" : " answers")}</div>
                <div className="QStat">{question.views + ((question.views === 1) ? " view" : " views")}</div>
                <div className="QStat">{question.votes + ((question.votes === 1) ? " vote" : " votes")}</div>
            </div>

            <div className="QBody">
                <div className="QTitle">
                    <span onClick={ handleQuestionClick }> {question.title} </span>
                </div>
                <p className="QSummary">
                    {question.summary}
                </p>
                <div className="QTags">
                    {tagButtons}
                </div>
            </div>

            <div className="QAskData">
                <span className="QUser">{question.asked_by.username}</span>
                <span className="QTime">{" asked " + getDateString(new Date(question.ask_date_time))}</span>
            </div>
        </div>
    );
    async function handleQuestionClick(){
        try {
            await viewQuestion(question);
            toAnswerPage(question);
        }
        catch (err) {
            handleError(err);
        }
        
    }
}



