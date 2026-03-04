import React from "react";
import UiButton from "../buttons/UIButton";
import UITextInput from "../input/UITextInput";
import UIHeadline from "../text/UIHeadline";
import UILink from "../buttons/UILink";

function UICreateAccountForm(props: any) {
    return (
        <React.Fragment>
            <div className="ui-login-form">
                <UIHeadline level={2} text="Create Account" />
                <div className="input-fields">
                    <UITextInput onChange={(e: any) => props.setLoginType({...props.loginType, username: e.target.value})} type="text" placeholder="Username" />
                    <UITextInput onChange={(e: any) => props.setLoginType({...props.loginType, email: e.target.value})} type="text" placeholder="Email" />
                    <UITextInput onChange={(e: any) => props.setLoginType({...props.loginType, password: e.target.value})} type="password" placeholder="Password" />
                    <UITextInput onChange={(e: any) => props.setLoginType({...props.loginType, passwordConfirm: e.target.value})} type="password" placeholder="Confirm Password" />
                </div>
                <UiButton type="button" text="Create Account" width="300px" onClick={props.handleLogin} />
                <UILink href="/login " text="Already have an account? Login here!" />
            </div>
        </React.Fragment>
    );
}

export default UICreateAccountForm;