import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
/**
 * Component representing the top banner of the website.
 * @param {Function} props.toHomePage Function to go to home page.
 * @param {Function} props.onSearchKeyDown Function to handle user enter key press for search bar.
 */
export default function Banner({user, toProfileUserPage=()=>{}, toHomePage=()=>{}, onSearchKeyDown=()=>{}, toLoginPage=()=>{}, handleLogout=()=>{} }) {
    return (
        <div className="Banner">
            <h1 onClick={() => {toHomePage()}}>Fake Stack Overflow </h1>
            <input onKeyDown={onSearchKeyDown} type="text" placeholder="Search..." />
            { user !== undefined && <button className="ProfileButton" onClick={() => { toProfileUserPage() }}>Profile</button>}
            { user === undefined && <LoginButton toLoginPage={toLoginPage} />}
            { user !== undefined && <LogoutButton handleLogout={handleLogout}/>}
        </div>
    );

}