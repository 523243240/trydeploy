
export default function LoginButton({toLoginPage=()=>{}}){

    return(
        <button id = "loginButton" onClick={() =>{toLoginPage()}}>Log in</button>
    )

}