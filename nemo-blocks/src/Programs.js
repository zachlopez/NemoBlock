/********************************************************************************************/
/* Programs.js                                                                              */
/*__________________________________________________________________________________________*/
/* Component that displays the list of existing programs from a user.                       */
/* Uses the setPage, setCurUser, setNewId global state functions.                           */
/* It also uses the curUser global state variables. All these must be passed as props.      */
/* The shown prop must also be passed to see if it is currently being displayed or not.     */
/********************************************************************************************/

import React, { useEffect, useState } from "react";
import FileDownload from "js-file-download";
import 'bootstrap/dist/css/bootstrap.css';

export default function Programs(props) {
    const [prgNames, setPrgNames] = useState({});
    const [dlg, setDlg] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [delId, setDelId] = useState(-1);
    const [delName, setDelName] = useState("");
    const [showDelete, setShowDelete] = useState(false);
    const [showNav, setShowNav] = useState(false);

    useEffect(() => {
        async function getPrgNames () {
            const response = await fetch('/getPrgNames', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: props.curUser}),
            });
            let body = await response.text();
            body = JSON.parse(body);
            setDlg(body.stat);
            if (body.stat === " ") setPrgNames(body.val);
        };
        if (props.shown) {
            getPrgNames();
        }
    });

    let handleClick = e => {
        props.setNewId(e.target.id.substring(3));
        props.setPage("Workspace");
    };

    let handleDelete = async e => {
        e.preventDefault();
        setShowConfirm(true);
        setDelId(e.target.id.substring(3));
        setDelName(document.getElementById("val" + e.target.id.substring(3)).value);
    };

    let handleYes = async e => {
        e.preventDefault();
        const response = await fetch('/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: props.curUser, id: delId}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        if (body.stat !== "Success") setDlg(body.stat);
        setShowConfirm(false);
    };

    let handleNo = async e => {
        e.preventDefault();
        setShowConfirm(false);
    };

    let handleLogout = async e => {
        e.preventDefault();
        props.setCurUser("");
        props.setPage("Login");
    };

    let handleDestroy = async e => {
        e.preventDefault();
        setShowDelete(true);
    };

    let handleCancel = async e => {
        e.preventDefault();
        setShowDelete(false);
    };

    let handleContinue = async e => {
        e.preventDefault();
        const response = await fetch('/destroy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: props.curUser}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        setDlg(body.stat);
        if (body.stat === 'Success!') {
            props.setCurUser("");
            props.setPage("Login");
        }
    };

    let handleDownloadClick = async e => {
        let downloadId = e.target.id.substring(3);
        const response = await fetch('/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: props.curUser, id: downloadId}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        if (body.stat.includes("success") || body.stat.includes("Success")) {
            const response = await fetch('/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: props.curUser, id: downloadId}),
            });
            let blob = await response.blob();
            FileDownload(blob, body.val.filename + '.xml');
        }
    }

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
                        <div class="nav-item nav-link active">Programs</div>
                        <div class="nav-item nav-link" onClick={handleDocumentationClick}>Documentation</div>
                        <div class="nav-item nav-link" onClick={handleFeedbackClick}>Feedback</div>
                    </div>
                </div>
            </div>
            <div class="card mt-4">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" key="key-1">
                        New Program
                        <button class="btn btn-outline-primary float-end" id="val-1" onClick={handleClick}>Create</button>
                    </li>
                    {(Object.keys(prgNames).length === 0) ? <li class="list-group-item" key="ProgramsLoading">
                            Programs loading...
                        </li> : <></>}
                    {Object.entries(prgNames).map((pair) => 
                        <li class="list-group-item" key={"key"+pair[0]}>
                            {pair[1]}
                            <div class="btn-toolbar float-end">
                            <input value={pair[1]} style={{display: "none"}} id={"val"+pair[0]} readOnly></input>
                            <button class="btn btn-outline-primary" id={"edi"+pair[0]} onClick={handleClick}>Edit</button>
                            <button class="btn btn-outline-primary mx-3" id={"xpt"+pair[0]} onClick={handleDownloadClick}>Export</button>
                            <button class="btn btn-outline-danger" id={"del"+pair[0]} onClick={handleDelete}>Delete</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
            {dlg}
            <div class="btn-toolbar my-3">
                <button class="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
                <button class="btn btn-outline-danger mx-3" onClick={handleDestroy}>Delete Account</button>
            </div>
            {
                (showConfirm) ?
                <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "30vw"}} class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Confirm Delete</h4>
                    <p>You are about to delete the file named '{delName}'.<br/>Continue?</p>
                    <hr />
                    <div class="btn-toolbar">
                        <button class="btn btn-outline-dark" onClick={handleYes}>Yes</button>
                        <button class="btn mx-3 btn-outline-dark" onClick={handleNo}>No</button>
                    </div>
                </div>
                :
                <></>
            }
            {
                (showDelete) ?
                <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "30vw"}} class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Confirm Delete</h4>
                    <p>You are about to delete your account.<br/>Press continue to destroy the '{props.curUser}' account.</p>
                    <hr />
                    <div class="btn-toolbar">
                        <button class="btn btn-outline-dark" onClick={handleCancel}>Cancel</button>
                        <button class="btn mx-3 btn-outline-danger" onClick={handleContinue}>Continue</button>
                    </div>
                </div>
                :
                <></>
            }
        </div>
    );
}