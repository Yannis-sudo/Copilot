import React, { useState } from "react";
import UICreateAccountForm from "../components/containers/UICreateAccountForm";

export default function CreateAccountPage(props: any) {
    let [loginType, setLoginType] = useState({
        email: "",
        password: "",
        username: "",
        passwordConfirm: "",
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
                <UICreateAccountForm loginType={loginType} setLoginType={setLoginType} handleLogin={handleLogin} />
            </div>
        </React.Fragment>
    );
}