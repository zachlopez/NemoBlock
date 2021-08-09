/********************************************************************************************/
/* Import.js                                                                                */
/*__________________________________________________________________________________________*/
/* Component with the NemoBot workspace, handling display of translated code.               */
/* Uses the setPage and setCurUser global state functions.                                  */
/* Also uses the curUser and newId global state variables. These must be passed as props.   */
/********************************************************************************************/

import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';

export default function Import(props) {
    let fileReader;
    const [xml, setXml] = useState("");
    const [filename, setFilename] = useState("");
    const [title, setTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [dlg, setDlg] = useState("");
    const [showDlg, setShowDlg] = useState(false);

    // File reader handler
    let handleFileRead = e => {
        setXml(fileReader.result);
    }

    // File change handler
    let handleChangeFile = async file => {
        fileReader = new FileReader();
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
        setFilename(file.name.substring(0, file.name.length-4));
    }

    // Back button handler
    let handleBack = async e => {
        e.preventDefault();
        props.setPage("Programs");
    };

    // Save button handler
    let handleSave = async e => {
        e.preventDefault();
        if (xml === "") {
            setDlg("No file selected or file is empty.");
            setShowDlg(true);
        } else if (title.trim() === "" || filename.trim() === "") {
            setDlg("Title or filename are empty. Click the 'More' button to edit them.");
            setShowDlg(true);
        } else if (props.curUser === "") {
            setDlg("Please login before saving.");
            setShowDlg(true);
        } else {
            const response = await fetch('/save', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({user: props.curUser, id: "-1", filename: filename, title: title, intro: intro, program: xml}),
            });
            let body = await response.text();
            body = JSON.parse(body);
            if (body.stat.includes("success") || body.stat.includes("Success")) {
                props.setPage("Programs");
            } else {
                setDlg(body.stat);
                setShowDlg(true);
            }
        }
    };

    return (
        <div style={{width: "100vw", overflow: "hidden"}} class="container-fluid px-0">
            <div class="row px-3">
                <div class="col-12 col-md-2 col-xl-3 px-0">
                </div>
                <div style={{height: "100vh", maxHeight: "100vh"}} class="col-12 col-md-10 col-xl-6 pl-0 pr-4">
                    <div class="input-group mb-3 form-g px-3 pt-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Import</span>
                        </div>
                        <input type="file" class="form-control" accept="text/xml" onChange={e => handleChangeFile(e.target.files[0])} />
                    </div>
                    <div class="input-group mb-3 form-g px-3 pt-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Filename</span>
                        </div>
                        <input type="text" class="form-control" value={filename} onChange={e => setFilename(e.target.value)} />
                    </div>
                    <div class="input-group mb-3 form-g px-3 pt-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Title</span>
                        </div>
                        <input type="text" class="form-control" value={title} onChange={e => setTitle(e.target.value)} />
                    </div>
                    <div class="input-group mb-3 form-g px-3 pt-1">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Intro</span>
                        </div>
                        <textarea class="form-control" aria-label="Intro"
                            value={intro}
                            onChange={e => setIntro(e.target.value)}
                        ></textarea>
                    </div>
                    <div style={{height: "5%"}} class="btn-toolbar d-flex justify-content-around">
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class="btn btn-outline-primary" onClick={handleSave}>Save</button>
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class="btn btn-outline-primary" onClick={handleBack}>Back</button>
                    </div>
                </div>
                <div class="col-12 col-md-2 col-xl-3 px-0">
                </div>
            </div>
            { (showDlg) ?
                (
                    (dlg.includes("success") || dlg.includes("Success")) ?
                    <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "20vw"}} 
                        class="alert alert-success alert-dismissible fade show" r
                        ole="alert" onClick={e => setShowDlg(false)}>
                        <strong>x {dlg}</strong>
                    </div>
                    :
                    (dlg === "Saved with errors.") ?
                    <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "20vw"}} 
                        class="alert alert-warning alert-dismissible fade show" r
                        ole="alert" onClick={e => setShowDlg(false)}>
                        <strong>x {dlg}</strong>
                    </div>
                    :
                    <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "20vw"}} 
                        class="alert alert-danger alert-dismissible fade show" r
                        ole="alert" onClick={e => setShowDlg(false)}>
                        <strong>x {dlg}</strong>
                    </div>
                )
                :
                <></>
            }
        </div>
    );
}

