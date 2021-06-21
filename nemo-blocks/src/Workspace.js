import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import toolbox from "./Toolbox";

export default function Workspace(props) {
    const [xml, setXml] = useState("");
    const [javascriptCode, setJavascriptCode] = useState("");
    const [curId, setCurId] = useState(-1);
    const [filename, setFilename] = useState("");
    const [title, setTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [dlg, setDlg] = useState("");
    const [showDlg, setShowDlg] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [initialXml, setInitialXml] = useState("");
    const tmpXml =
        `<xml xmlns="https://developers.google.com/blockly/xml">
        <block type="start" id="6_S},[q^:L,cFM/+.=gR" x="10" y="10" deletable="false"></block>
        <block type="repeat" id=";OK~g^Rs@TDIso-B]w1{" x="470" y="10" deletable="false"></block>
        </xml>`;

    function workspaceDidChange(workspace) {
        let code = Blockly.JavaScript.workspaceToCode(workspace);
        code = code + "module.exports = {\n" + 
        "   filename: '" + filename + "',\n" + 
        "   title: '" + title + "',\n" +
        "   introduction: [" + ((intro === "") ? "" : ("'" + intro.replaceAll('\n', "','")) + "'") + "],\n" + 
        "   start: start,\n" + 
        "   state: state,\n" + 
        "};\n"
        setJavascriptCode(code);
    }

    let handleLogout = async e => {
        e.preventDefault();
        props.setCurUser("");
        props.setPage("Login");
    };

    let handleBack = async e => {
        e.preventDefault();
        props.setPage("Programs");
    };

    let handleMore = async e => {
        e.preventDefault();
        setShowMore(!showMore);
    };

    let handleSave = async e => {
        e.preventDefault();
        if (props.curUser === "") {
            setDlg("Please login before saving.");
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
            if (dlg.includes("success") || dlg.includes("Success")) setCurId(body.val);
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
            if (dlg.includes("success") || dlg.includes("Success")) {
                setCurId(body.val.id);
                setFilename(body.val.filename);
                setTitle(body.val.title);
                setIntro(body.val.intro);
                setInitialXml(body.val.program);
            }
            setShowDlg(true);
            setDlg(body.stat);
        };
        if (initialXml === "") {
            if (props.newId === "-1") {
                setInitialXml(tmpXml);
            } else {
                handleLoad();
            }
        }
    });

    return (
        <div style={{width: "100%"}} class="container-fluid px-0">
            { (initialXml !== "") ?
            <div class="row">
                <div class="col-9 px-0">
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
                <div class="col-3 px-0">
                    { (!showMore) ? 
                    <textarea
                        class="h-90"
                        id="code"
                        rows="34"
                        style={{width: "100%", resize: "none", overflowX: "scroll", fontSize: "1.8vh", border: "none"}}
                        value={javascriptCode}
                        readOnly
                    ></textarea>
                    : 
                    <>
                    <div class="input-group mb-3 form-g px-3 pt-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text">Name</span>
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
                    <div class="btn-toolbar d-flex justify-content-around pb-3">
                        <button style={{width: "91%"}} class="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
                    </div>
                    </>
                    }
                    <div class="btn-toolbar d-flex justify-content-around">
                        <button style={{width: "25%"}} class="btn btn-outline-primary" onClick={handleSave}>Save</button>
                        <button style={{width: "25%"}} class="btn btn-outline-primary" onClick={handleBack}>Back</button>
                        <button style={{width: "25%"}} class={"btn btn-outline-primary" + ((showMore) ? " active" : "")} onClick={handleMore}>...</button>
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
        </div>
    );
}