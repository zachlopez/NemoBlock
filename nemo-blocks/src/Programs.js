import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Programs(props) {
    const [prgNames, setPrgNames] = useState({});
    const [dlg, setDlg] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [delId, setDelId] = useState(-1);
    const [delName, setDelName] = useState("");

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

    return (
        <div class="mx-5 mt-5">
            <div class="card">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item" key="key-1">
                        New Program
                        <button class="btn btn-outline-primary float-end" id="val-1" onClick={handleClick}>Create</button>
                    </li>
                    {Object.entries(prgNames).map((pair) => 
                        <li class="list-group-item" key={"key"+pair[0]}>
                            {pair[1]}
                            <div class="btn-toolbar float-end">
                            <input value={pair[1]} style={{display: "none"}} id={"val"+pair[0]} readOnly></input>
                            <button class="btn btn-outline-primary mx-3" id={"edi"+pair[0]} onClick={handleClick}>Edit</button>
                            <button class="btn btn-outline-primary" id={"del"+pair[0]} onClick={handleDelete}>Delete</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
            {dlg}
            <button class="btn btn-outline-primary my-3" onClick={handleLogout}>Logout</button>
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
        </div>
    );
}