import {postUser} from "../client.js"

// {toWelcomePage}
export default function CreateAccount({handleError=()=>{}, toLoginPage=()=>{}}) {
    return (
        <div className="login">
            
                <h1>Create your account</h1>

                <p>Username:</p>
                <input id ="username_create" type="text" placeholder="username here" required />

                <p>Email:</p>
                <input id ="e_mail_create" type="text" placeholder="johnsmith@gmail.com" required />
                

                <p> Password: </p> 
                <input id ="password_create" type="password" placeholder="*********************" required />
                 

                <p> Repeat Your Password: </p>
                <input id ="password_create_repeat" type="password" placeholder="*********************" required />
                 
                <p id="create_err" className="login_error"></p>

                <button onClick={ () => accountCreate(toLoginPage)}>Create Account</button>
              
        </div>

    );

    async function accountCreate(toLoginPage){
        let user = document.getElementById("username_create").value.trim();
        let email = document.getElementById("e_mail_create").value.trim();
        let password = document.getElementById("password_create").value.trim();
        let re_password = document.getElementById("password_create_repeat").value.trim(); 
        let message = document.getElementById("create_err");

        //empty string enter
        if(user === "" || email === "" || password === "" || re_password ===""){    
            message.textContent = "All fields are required, please fill out all fields";  
            return;      
        }

        //Validate email
        let addressIdx = email.indexOf("@");
        //The '@' sign must exist and can't be the first character or the last character
        if (addressIdx === -1 || addressIdx === 0 || addressIdx === email.length - 1) {
            message.textContent = "Invalid email address"; 
            return;
        }

        if (password.indexOf(user) !== -1 || password.indexOf(email.slice(0, email.indexOf("@"))) !== -1) {
            message.textContent = "Password must not contain the username or email id";
            return;
        }
        
        //check if 2 passwords entered are same 
        if(password !== re_password){
            message.textContent = "The two passwords don't match!";
            return;
        }

        try {
            await postUser({ user, password, email});
            toLoginPage();
        }
        catch (err){
            if (err.response && err.response.status === 409) {
                message.textContent = err.response.data;
            }
            else
                handleError(err);
        }
    }
}