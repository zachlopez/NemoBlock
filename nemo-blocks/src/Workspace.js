import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import toolbox from "./Toolbox";

export default function Workspace(props) {
    const tmpXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="start" id="6_S},[q^:L,cFM/+.=gR" deletable="false" x="10" y="10"></block><block type="repeat" id=";OK~g^Rs@TDIso-B]w1{" deletable="false" x="470" y="10"></block></xml>';
    const [xml, setXml] = useState("");
    const [javascriptCode, setJavascriptCode] = useState("");
    const [curId, setCurId] = useState("-1");
    const [filename, setFilename] = useState("");
    const [title, setTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [dlg, setDlg] = useState("");
    const [showDlg, setShowDlg] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [stalledProcess, setStalledProcess] = useState("");
    const [lastSaved, setLastSaved] = useState(JSON.stringify({user: props.curUser, id: "-1", filename: "", title: "", intro: "", program: tmpXml}));
    const [initialXml, setInitialXml] = useState("");
    
    function wasEdited() {
        return JSON.stringify({user: props.curUser, id: curId, filename: filename, title: title, intro: intro, program: xml}) !== lastSaved;
    }
    
    function workspaceDidChange(workspace) {
        let code = Blockly.JavaScript.workspaceToCode(workspace);
        code = "'use strict';\n" + 
        code + "module.exports = {\n" + 
        "  filename: '" + filename.replaceAll("'", "\\'") + "',\n" + 
        "  title: '" + title.replaceAll("'", "\\'") + "',\n" +
        "  introduction: [" + ((intro === "") ? "" : ("'" + intro.replaceAll("'", "\\'").replaceAll('\n', "','")) + "'") + "],\n" + 
        "  start: start,\n" + 
        "  state: state,\n" + 
        "};\n"
        setJavascriptCode(code);
    }

    let handleLogout = async e => {
        e.preventDefault();
        if (wasEdited()) {
            setShowConfirm(true);
            setStalledProcess("Logout");
        } else {
            props.setCurUser("");
            props.setPage("Login");
        }
    };

    let handleBack = async e => {
        e.preventDefault();
        if (wasEdited()) {
            setShowConfirm(true);
            setStalledProcess("Back");
        } else {
            props.setPage("Programs");
        }
    };

    let handleYes = async e => {
        e.preventDefault();
        if (stalledProcess === "Logout") {
            props.setCurUser("");
            props.setPage("Login");
        } else {
            props.setPage("Programs");
        }
    };

    let handleNo = async e => {
        e.preventDefault();
        setShowConfirm(false);
    };

    let handleMore = async e => {
        e.preventDefault();
        setShowMore(!showMore);
    };

    let handleSave = async e => {
        e.preventDefault();
        if (title.trim() === "" || filename.trim() === "") {
            setDlg("Title or filename are empty. Click the '...' button to edit them.");
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
                body: JSON.stringify({user: props.curUser, id: curId, filename: filename, title: title, intro: intro, program: xml}),
            });
            let body = await response.text();
            body = JSON.parse(body);
            if (body.stat.includes("success") || body.stat.includes("Success")) {
                setCurId(body.val);
                setLastSaved(JSON.stringify({user: props.curUser, id: body.val, filename: filename, title: title, intro: intro, program: xml}));
            }
            setDlg(body.stat);
            setShowDlg(true);
        }
    };

    useEffect(() => {
        async function handleLoad () {
            const response = await fetch('/load', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: props.curUser, id: props.newId}),
            });
            let body = await response.text();
            body = JSON.parse(body);
            if (body.stat.includes("success") || body.stat.includes("Success")) {
                setCurId(body.val.id);
                setFilename(body.val.filename);
                setTitle(body.val.title);
                setIntro(body.val.intro);
                setInitialXml(body.val.program);
                setXml(body.val.program);    
                setLastSaved(JSON.stringify({user: props.curUser, id: body.val.id, filename: body.val.filename, title: body.val.title, intro: body.val.intro, program: body.val.program}));
            }
            setShowDlg(true);
            setDlg(body.stat);
        };
        if (initialXml === "") {
            if (props.newId === "-1") {
                setInitialXml(tmpXml);
                setXml(tmpXml);
            } else {
                handleLoad();
            }
        }
    });

    return (
        <div style={{width: "100%"}} class="container-fluid px-0">
            { (initialXml !== "") ?
            <div class="row">
                <div class="col-12 col-md-7 col-xl-8 px-0">
                    <BlocklyWorkspace
                        toolboxConfiguration={toolbox}
                        initialXml={initialXml}
                        className="fill-height"
                        workspaceConfiguration={{
                            grid: {
                                spacing: 20,
                                length: 3,
                                colour: "#ccc",
                                snap: true,
                            },
                            zoom: {
                                controls: true,
                                wheel: true,
                                startScale: 1.0,
                                maxScale: 3,
                                minScale: 0.3,
                                scaleSpeed: 1.2,
                                pinch: true
                            },
                        }}
                        onWorkspaceChange={workspaceDidChange}
                        onXmlChange={setXml}
                    />
                </div>
                <div style={{height: "100%"}} class="col-12 col-md-5 col-xl-4 px-0">
                    { (!showMore) ? 
                    <textarea
                        class="h-90"
                        id="code"
                        rows="38"
                        style={{
                            width: "100%", 
                            resize: "none", 
                            whiteSpace: "pre",
                            overflowX: "scroll", 
                            fontSize: "1.6vh", 
                            border: "none", 
                            fontFamily: "monospace"
                        }}
                        value={javascriptCode}
                        readOnly
                    ></textarea>
                    : 
                    <>
                    <div class="input-group mb-3 form-g px-3 pt-3">
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
                    <div style={{height: "7.3%"}} class="btn-toolbar d-flex justify-content-around pb-3">
                        <button style={{fontSize: "1.9vh", width: "94%", height: "100%"}} class="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
                    </div>
                    </>
                    }
                    <div style={{height: "5%"}} class="btn-toolbar d-flex justify-content-around">
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class="btn btn-outline-primary" onClick={handleSave}>Save</button>
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class="btn btn-outline-primary" onClick={handleBack}>Back</button>
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class={"btn btn-outline-primary" + ((showMore) ? " active" : "")} onClick={handleMore}>...</button>
                    </div>
                </div>
            </div>
            :
            <>Loading workspace...</>
            }
            { (showDlg) ?
                (dlg.includes("success") || dlg.includes("Success")) ?
                <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "20vw"}} 
                    class="alert alert-success alert-dismissible fade show" r
                    ole="alert" onClick={e => setShowDlg(false)}>
                    <strong>x {dlg}</strong>
                </div>
                :
                <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "20vw"}} 
                    class="alert alert-danger alert-dismissible fade show" r
                    ole="alert" onClick={e => setShowDlg(false)}>
                    <strong>x {dlg}</strong>
                </div>
                :
                <></>
            }
            {
                (showConfirm) ?
                <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "30vw"}} class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Unsaved Changes</h4>
                    <p>Changes were made since the last save.<br/>If you exit now, these changes will be discarded.<br/>Continue?</p>
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