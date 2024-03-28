export default function LogoutButton({ handleLogout=()=>{} }){
    return(
        <button id = "logoutButton" onClick={() =>{handleLogout()}}>Log out</button>
    )

}
