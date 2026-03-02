import React from "react";
import UiButton from "../buttons/UIButton";
import UITextInput from "../input/UITextInput";
import UIHeadline from "../text/UIHeadline";

import "../../style/containers/ui-login-form.css";
import UILink from "../buttons/UILink";

function UILoginForm(props: any) {
    return (
        <React.Fragment>
            <div className="ui-login-form">
                <UIHeadline level={2} text="Login" />
                <div className="input-fields">
                    <UITextInput onChange={(e: any) => props.setLoginType({...props.loginType, email: e.target.value})} type="text" placeholder="Email" />
                    <UITextInput onChange={(e: any) => props.setLoginType({...props.loginType, password: e.target.value})} type="password" placeholder="Password" />
                </div>
                <UiButton type="button" text="Login" width="300px" className="btn btn-primary" onClick={props.handleLogin} />
                <UILink href="/create-account " text="Don't have an account? Sign up here!" />
            </div>
        </React.Fragment>
    );
}

export default UILoginForm;