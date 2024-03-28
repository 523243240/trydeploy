import {login} from "../client"
//toHomePage=()=>{}
export default function Login({ handleError=()=>{}, toCreateAccountPage=()=>{},toHomePage=()=>{}, setUser=()=>{} }) {
    return (
        <div className="login">
            
                <h1>Login to your account</h1>
         
                <p>Email: </p>
                <input id ="e-mail" type="text" placeholder="johnsmith@gmail.com" required />
                <p id="email_error" className="login_error"></p>
                <p> Password: </p>
                <input id ="password" type="password" placeholder="*********************" required /> 
                <p id="password_error" className="login_error" ></p>
                <button className="LoginButton" onClick={UserLogin}>Log in</button>
                <p id="error" className="login_error"></p>
                <div className="footer">
                    <p>Not registered? <a className="tag_name" onClick={()=>{toCreateAccountPage()}}>Create Account</a></p>
                </div>
            
        </div>

    );

    async function UserLogin(){
        let email = document.getElementById("e-mail").value.trim(); 
        let password = document.getElementById("password").value.trim(); 
        let err = false ; 

        document.getElementById("email_error").textContent = "";
        document.getElementById("password_error").textContent = "";
        document.getElementById("error").textContent = "";

        //if email is empty display error message 
        if(email === "")
        {
            document.getElementById("email_error").textContent = "Email cannot be empty.";
            err = true ; 
        }
        //if password is empty 
        if(password === ""){
            document.getElementById("password_error").textContent = "Password cannot be empty.";
            err = true; 
        }

        if(err === false){
            try {
                let res = await login(email, password);
                setUser(res.data);
                toHomePage();
            }
            catch (err) {
                if (err.response && err.response.status === 401)
                    document.getElementById("error").textContent = "Password/Email is not correct";
                else 
                    handleError(err);
            }
        }
        
    }

}

