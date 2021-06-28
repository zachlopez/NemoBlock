import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Login(props) {
    const [userField, setUserField] = useState("");
    const [passField, setPassField] = useState("");
    const [dlg, setDlg] = useState("");

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
    return (
        <div class="mx-5 mt-5">
            <h1>Nemoblocks</h1>
            {(dlg !== "")? ((dlg !== "Success!") ? <div class="alert alert-danger" role="alert">{dlg}</div>: <div class="alert alert-success" role="alert">{dlg}</div>) : <></>}
            <div class="input-group mb-3 form-g">
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