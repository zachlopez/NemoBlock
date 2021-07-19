/********************************************************************************************/
/* Login.js                                                                                 */
/*__________________________________________________________________________________________*/
/* Component used for logging in users.                                                     */
/* Uses the setPage and setCurUser global state variables which must be passed in as props. */
/********************************************************************************************/

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Login(props) {
    const [userField, setUserField] = useState("");
    const [passField, setPassField] = useState("");
    const [dlg, setDlg] = useState("");
    const [showNav, setShowNav] = useState(false);

    let handleLogin = async e => {
        e.preventDefault();
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({pass: passField, user: userField}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        setPassField("");
        setDlg(body.stat);
        if (body.stat === "Success!") {
            props.setCurUser(body.val); // Sends back username of user that was logged in
            setUserField("");
            props.setPage("Programs");
        };
    };

    let handleCreate = async e => {
        e.preventDefault();
        if (passField.length < 4 || userField < 4) {
            setDlg("Username or password is too short.");
            return;
        }
        const response = await fetch('/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({pass: passField, user: userField}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        setDlg(body.stat);
    };

    let handleDocumentationClick = async e => {
        e.preventDefault();
        props.setPage("Documentation");
    };

    let handleFeedbackClick = async e => {
        e.preventDefault();
        props.setPage("Feedback");
    };

    return (
        <div class="mx-5 mt-5">
            <div class="navbar navbar-expand-lg navbar-light bg-light">
                <h3 style={{marginRight: "1rem"}}>NemoBlocks</h3>
                <button class="navbar-toggler" type="button" aria-expanded="false" aria-label="Toggle navigation" onClick={e => setShowNav(!showNav)}>
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class={"navbar-collapse collapse " + ((showNav) ? " show" : "")} aria-expanded="false" aria-label="Toggle navigation">
                    <div class="navbar-nav">
                        <div class="nav-item nav-link active">Login</div>
                        <div class="nav-item nav-link" onClick={handleDocumentationClick}>Documentation</div>
                        <div class="nav-item nav-link" onClick={handleFeedbackClick}>Feedback</div>
                    </div>
                </div>
            </div>
            {(dlg !== "")? ((dlg !== "Success!") ? <div class="alert alert-danger" role="alert">{dlg}</div>: <div class="alert alert-success" role="alert">{dlg}</div>) : <></>}
            <div class="input-group mb-3 form-g mt-4">
                <div class="input-group-prepend">
                    <span class="input-group-text">Username</span>
                </div>
                <input type="text" class="form-control" value={userField} onChange={e => setUserField(e.target.value)} />
            </div>
            <div class="input-group mb-3">
                <div class="input-group-prepend">
                    <span class="input-group-text">Password</span>
                </div>
                <input type="password" class="form-control" value={passField} onChange={e => setPassField(e.target.value)} />
            </div>
            <div class="btn-toolbar">
                <button class="btn btn-outline-primary" onClick={handleLogin}>Login</button>
                <button class="btn mx-3 btn-outline-primary" onClick={handleCreate}>Create Account</button>
            </div>
        </div>
    );
}