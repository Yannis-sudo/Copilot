import React, { useState } from "react";

// Import Components
import UILoginForm from "../components/containers/UILoginForm";

function LoginPage(props: any) {
    let [loginType, setLoginType] = useState({
        email: "",
        password: "",
    }); // "login" or "signup"

    const handleLogin = () => {
     // Implement Login Logioc here (e.g., API call, validation, etc.)
     // On successful login, update user state in App component and navigate to home page
     // Use props.setUser to update user state in App component
     // Example: props.setUser({ username: "exampleUser", email: "
     // On failure, show error message (e.g., using a state variable for error)
     console.log("Login attempted with:", loginType);
     // Example: setUser({ username: "exampleUser", email: "
    }

    return (
        <React.Fragment>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "90vh" }}>
                <UILoginForm loginType={loginType} setLoginType={setLoginType} handleLogin={handleLogin} />
            </div>
        </React.Fragment>
    );
}

export default LoginPage;