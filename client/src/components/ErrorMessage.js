
export default function ErrorMessage({ message, toWelcomePage }) {
    return (
            <> 
                { message !== "" && 
                    <div className="ErrorMessage">
                        {message}
                        <span> </span>
                        <a onClick={toWelcomePage} href="">Go back to Welcome Page</a>
                    </div>
                }
            </>
    );
}