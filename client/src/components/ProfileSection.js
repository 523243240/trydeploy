import { useState } from 'react';;
import { getDateString } from '../utils.js';
import { getUserById, deleteUser } from '../client.js';

export default function ProfileSection({ user, questions, toEditQuestion, allUsers, toProfileUserPage, handleError=()=>{} }) {
    const [refresh, setRefresh] = useState(true); 
    const [alter, setAlter] = useState(false); 
    const [userData,setUserData] = useState(user);
    allUsers = allUsers.filter((u) => u._id !== user._id); 
    async function getUser(oneUser){
        try {
            let userId = oneUser._id; 
            let userObj = await getUserById(userId); 
            toProfileUserPage(userObj.data);
        }
        catch (err) {
            handleError(err);
        }
    }

    async function delUser(){
        try {
            setAlter(false);
            setRefresh(!refresh);
            await deleteUser(userData._id);
            toProfileUserPage(user);
        }
        catch (err) {
            handleError(err);
        }
    }
    function cancelAction(){
        setAlter(false); 
    }
    function alterDisplay(oneUser){
        setAlter(true); 
        setUserData(oneUser);
    }
    questions.sort((q1, q2) => { return new Date(q2.ask_date_time) - new Date(q1.ask_date_time)});
    return (
        <div className="ProfileUser" >
            <h1>User Profile</h1>
            <p>Username         : {user.username}</p>
            <p>Member Since : {getDateString(new Date(user.registerDate))}</p>
            <p>Reputation   : {user.reputation}</p>
            {user.isAdmin && <p className="UsersInSystem">User registered in FakeStackOverflow: </p>}
            {(user.isAdmin && allUsers.length === 0)? (<div id="NoQuestionsFound"> No user registered </div>):<br></br>}
            {((user.isAdmin && alter) && (<div className='alter-container'>
                <p>Are you sure you want to delete user?</p>
                <p id="userToDel"></p>
                    <button  onClick={delUser}>Yes</button>
                    <button  onClick={cancelAction}>No</button>
            </div>))}
            {user.isAdmin && allUsers.map((oneUser)=>{
                    return ( 
                        <div key = {oneUser._id} className = "UserInSystem">
                            <span className='UserLink' onClick={()=>{getUser(oneUser)}}>{oneUser.username}</span>
                            { oneUser._id !== user._id && <button onClick ={()=>{alterDisplay(oneUser)}} className="DeleteUserButton"> DeleteUser</button> }
                        </div>
                            
                    )
                })}
            <p className="QuestionsAsked"> {"Questions you've asked:"} </p>
            <p style={{ fontSize: "12px" }}> Click on title to edit/delete </p>
            {(questions.length === 0)? (<div id="NoQuestionsFound"> No Questions Found </div>):<br></br>}
            {questions.map((qes)=>{
            return ( 
                <div key={qes._id}>
                <span className='tag_name' onClick={()=>toEditQuestion(qes)}>{qes.title}</span>
                <p></p>
                </div>
                )
            })}
        </div>
    );
}