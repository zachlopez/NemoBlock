import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Programs(props) {
    const [prgNames, setPrgNames] = useState({});
    const [dlg, setDlg] = useState("");

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
            if (body.stat === " ") setPrgNames(body.val);
            setDlg(body.stat);
        };
        getPrgNames();
    });

    let handleClick = e => {
        props.setNewId(e.target.id);
        props.setPage("Workspace");
    };

    let handleDelete = async e => {
        e.preventDefault();
        const response = await fetch('/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: props.curUser, id: e.target.id}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        if (body.stat !== "Success") setDlg(body.stat);
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
                    <li class="list-group-item">
                        New Program
                        <button class="btn btn-outline-primary float-end" id={-1} onClick={handleClick}>Create</button>
                    </li>
                    {Object.entries(prgNames).map((pair) => 
                        <li class="list-group-item">
                            {pair[1]}
                            <div class="btn-toolbar float-end">
                            <button class="btn btn-outline-primary mx-3" id={pair[0]} onClick={handleClick}>Edit</button>
                            <button class="btn btn-outline-primary" id={pair[0]} onClick={handleDelete}>Delete</button>
                            </div>
                        </li>
                    )}
                </ul>
            </div>
            {dlg}
            <button class="btn btn-outline-primary my-3" onClick={handleLogout}>Logout</button>
        </div>
    );
}