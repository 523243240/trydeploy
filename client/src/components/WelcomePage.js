

export default function WelcomePage({ toLoginPage = () => {}, toCreateAccountPage = () => {}, toHomePage = () => {} }) {
    return (<>
        <h1 id="WelcomeHeader"> Welcome to FakeStackOverflow! </h1>
        <div id="WelcomeBody">
            <div id="WelcomeButtonsContainer">
                <button onClick={() => {toLoginPage()}} className="WelcomeButton"> Login as existing user </button>
                <button onClick={() => {toCreateAccountPage()}} className="WelcomeButton"> Register as a new user </button>
                <button onClick={() => {toHomePage()}} className="WelcomeButton"> Continue as guest </button>
            </div>
        </div>
    </>   
    );
}