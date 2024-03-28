import { useEffect, useState } from 'react';
import UserProfileMenu from './UserProfileMenu.js';
import ProfileSection from './ProfileSection.js';
import EditQuestion from './EditQuestion.js';
import QuestionsAnswered from './QuestionsAnswered.js';
import TagPage from './TagPage.js'
import { getUserQuestions, getUser, getUserQuestionsAnswered, getTag, getAllQuestions, getQuestion, getAllUsers } from '../client.js';
import EditTag from './EditTag.js';
import EditAnswer from './EditAnswer.js';
import AnswerPage from './AnswerPage.js';

export default function ProfileUser({user, questions, allUsers=[], toAskQuestionPage=()=>{}, onTagClick=()=>{}, handleError=()=>{}, toProfileUserPage=()=>{}}){
	const [section, setSection] = useState(<ProfileSection user={user} allUsers={allUsers} questions={questions} toEditQuestion={toEditQuestion} toProfileUserPage={toProfileUserPage} handleError={handleError}/>)
	const [selectedMenu, setSelectedMenu] = useState(0);

	useEffect(() => {
		toProfile();
	}, [user]);

	async function toProfile() {
		try {
			user = (await getUser(user)).data;
			questions = (await getUserQuestions(user)).data;
			allUsers = [];
			if (user.isAdmin)
				allUsers = (await getAllUsers()).data;
			setSelectedMenu(0);
			setSection(<ProfileSection user={user} questions={questions} toEditQuestion={toEditQuestion} allUsers={allUsers} toProfileUserPage={toProfileUserPage} handleError={handleError}/>)
		}
		catch (err) {
			handleError(err);
		}
	}

	function toEditQuestion(question) {
		setSelectedMenu(-1);
		setSection(<EditQuestion toProfile={toProfile} user={user} question={question} handleError={handleError}/>)
	}

	async function toQuestionsAnswered() {
		try {
			questions = (await getUserQuestionsAnswered(user)).data;
			setSelectedMenu(1);
			setSection(<QuestionsAnswered user={user} handleError={handleError} questions={questions} toAnswers={toAnswers} onTagClick={onTagClick} />)
		}
		catch (err) {
			handleError(err);
		}
	}

	async function toTagsCreated() {
		try {
			user = (await getUser(user)).data;
			let tags = []; 
			for(let i = 0; i < user.tags.length; i++) {

				let result = await getTag(user.tags[i]);
				tags.push(result.data); 
			}

			let responseQes;
			responseQes = await getAllQuestions();
			setSelectedMenu(2);
			setSection(<TagPage toEditTag={toEditTag} allowEdit={true} user={user} tags={tags} title="Your Tags" toAskQuestionPage={toAskQuestionPage} onTagClick={onTagClick} questions = {responseQes.data}/>)
		} catch (err) {
			handleError(err);
		}
	}

	function toEditTag(tag) {
		setSelectedMenu(-1);
		setSection(<EditTag user={user} tag={tag} toTagsCreated={toTagsCreated} handleError={handleError}/>);
	}

	async function toAnswers(question) {
		try {
			setSelectedMenu(-1);
			question = (await getQuestion(question)).data; //Get the most recent version of this question
			setSection(<AnswerPage toEditAnswer={toEditAnswer} allowEdit={true} user={user} handleError={handleError} question={question} toAskQuestionPage={toAskQuestionPage} onTagClick={onTagClick} />);
		}
		catch (err) {
			handleError(err);
		}
	}

	function toEditAnswer(answer, question) {
		setSelectedMenu(-1);
		setSection(<EditAnswer question={question} toAnswerPage={toAnswers} answer={answer} toAnswers={toAnswers}/>);
	}

	return(
		<>
			<UserProfileMenu toProfile={toProfile} toQuestionsAnswered={toQuestionsAnswered} toTagsCreated={toTagsCreated} selectedMenu={selectedMenu}/>
			{section}
		</>
	);


}
