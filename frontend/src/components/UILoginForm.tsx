import React from "react";

function UILoginForm() {
    return (
        <React.Fragment>
            <div className="d-flex align-items-center justify-content-center flex-column" style={{ height: "80vh" }}>
                <h1 className="text-center mb-4 pb-100">Login</h1>
                <form style={{ width: "400px" }}>
                    <div className="mb-3 d-flex align-items-center">
                        <label htmlFor="inputEmail3" className="col-form-label me-2" style={{ width: "100px" }}>
                            Email
                        </label>
                        <input type="email" className="form-control flex-grow-1" id="inputEmail3" />
                    </div>
                    <div className="mb-3 d-flex align-items-center">
                        <label htmlFor="inputPassword3" className="col-form-label me-2" style={{ width: "100px" }}>
                            Password
                        </label>
                        <input type="password" className="form-control flex-grow-1" id="inputPassword3" />
                    </div>
                    <div className="d-flex gap-2">
                        <button type="submit" className="btn btn-primary flex-fill">
                            Sign in
                        </button>
                        <a href="#" className="btn btn-primary flex-fill" role="button">
                            Create Account
                        </a>
                    </div>
                </form>
            </div>
        </React.Fragment>
    );
}

export default UILoginForm;