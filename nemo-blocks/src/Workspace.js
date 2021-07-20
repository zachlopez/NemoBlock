/********************************************************************************************/
/* Workspace.js                                                                             */
/*__________________________________________________________________________________________*/
/* Component with the NemoBot workspace, handling display of translated code.               */
/* Uses the setPage and setCurUser global state functions.                                  */
/* Also uses the curUser and newId global state variables. These must be passed as props.   */
/********************************************************************************************/

import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import Blockly from "blockly";
import { BlocklyWorkspace } from "react-blockly";
import toolbox from "./Toolbox";

export default function Workspace(props) {
    const tmpXml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="start" id="6_S},[q^:L,cFM/+.=gR" deletable="false" x="10" y="10"></block><block type="repeat" id=";OK~g^Rs@TDIso-B]w1{" deletable="false" x="470" y="10"></block></xml>';
    const [xml, setXml] = useState("");
    const [javascriptCode, setJavascriptCode] = useState("");
    const [selectedCode, setSelectedCode] = useState("");
    const [curId, setCurId] = useState("-1");
    const [filename, setFilename] = useState("");
    const [title, setTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [dlg, setDlg] = useState("");
    const [showDlg, setShowDlg] = useState(false);
    const [showMore, setShowMore] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [addDebug, setAddDebug] = useState(false);
    const [stalledProcess, setStalledProcess] = useState("");
    const [lastSaved, setLastSaved] = useState(JSON.stringify({user: props.curUser, id: "-1", filename: "", title: "", intro: "", program: tmpXml}));
    const [initialXml, setInitialXml] = useState("");
    
    // Translates the code of a function block
    function generateDefProcedureCode(block) {
        var funcName = block.getFieldValue('NAME');
        var xfix1 = '';
        if (Blockly.JavaScript.STATEMENT_PREFIX)
            xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_PREFIX, block);
        if (Blockly.JavaScript.STATEMENT_SUFFIX)
            xfix1 += Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX, block);
        if (xfix1)
            xfix1 = Blockly.JavaScript.prefixLines(xfix1, Blockly.JavaScript.INDENT);
        var loopTrap = '';
        if (Blockly.JavaScript.INFINITE_LOOP_TRAP) {
            loopTrap = Blockly.JavaScript.prefixLines(
                Blockly.JavaScript.injectId(Blockly.JavaScript.INFINITE_LOOP_TRAP,
                block), Blockly.JavaScript.INDENT
            );
        }
        var branch = Blockly.JavaScript.statementToCode(block, 'STACK');
        var returnValue = Blockly.JavaScript.valueToCode(block, 'RETURN',
            Blockly.JavaScript.ORDER_NONE) || '';
        var xfix2 = '';
        if (branch && returnValue) {
            // After executing the function body, revisit this block for the return.
            xfix2 = xfix1;
        }
        if (returnValue) {
            returnValue = Blockly.JavaScript.INDENT + 'return ' + returnValue + ';\n';
        }
        var args = [];
        var variables = block.getVars();
        for (var i = 0; i < variables.length; i++) {
            args[i] = Blockly.JavaScript.nameDB_.getName(variables[i],
            Blockly.VARIABLE_CATEGORY_NAME);
        }
        var code = 'function ' + funcName + '(' + args.join(', ') + ') {\n' +
            xfix1 + loopTrap + branch + xfix2 + returnValue + '}';
        return Blockly.JavaScript.scrub_(block, code);
    }
    
    // Checks if the workspace was edited
    function wasEdited() {
        return JSON.stringify({user: props.curUser, id: curId, filename: filename, title: title, intro: intro, program: xml}) !== lastSaved;
    }
    
    // When the workspace changed, run this function
    function workspaceDidChange(workspace) {
        var varList = Blockly.Variables.allUsedVarModels(workspace);
        let code = Blockly.JavaScript.workspaceToCode(workspace);
        let codeLines = code.split("\n");
        let codeStart = "";
        let codeInit = 0;
        let reqAxios = "";
        let debugCode = "";

        // If the program has variables, remove them and put them at the start
        if (codeLines[0].indexOf("var") === 0) {
            codeStart = codeLines[0] + "\n" + codeLines[1] + "\n";
            codeInit = 2;
        }

        // If the program uses axios, require the axios library
        if (code.includes("axios")) reqAxios = "const axios = require('axios');\n";

        // If debug mode is activated, adds debug functions
        if (addDebug) {
            debugCode = "" +
            "// wraps the start function in a try-catch statement for debug mode\n" + 
            "const debug_start = (sayIn, sendButtonIn) => {\n" +
            "  try {\n" +
            "    start(sayIn, sendButtonIn);\n" +
            "  }\n" +
            "  catch (err) {\n" +
            "    if (typeof err === 'string') sayIn('An error occured: ' + err);\n" +
            "    else sayIn('*An error occured: ' + err.message + '*');\n" + 
            "  }\n" +
            "};\n\n" +
            "// wraps the repeat function in a try-catch statement for debug mode\n" + 
            "const debug_repeat = (payload, sayIn, sendButtonIn) => {\n" +
            "  try {\n" +
            "    repeat(payload, sayIn, sendButtonIn);\n" +
            "  }\n" +
            "  catch (err) {\n" +
            "    if (typeof err === 'string') sayIn('An error occured: ' + err);\n" +
            "    else sayIn('*An error occured: ' + err.message + '*');\n" + 
            "  }\n" +
            "};\n";
        }

        code = "'use strict';\n" + 
        reqAxios + // Axios library if needed
        "var say, sendButton;\n" + 
        codeStart + // Variables used removed from the beginning of the translation
        "\n\n// puts all used variables in a dictionary object\n" + 
        "const summarizeVariables = () => { \n" +
            "  return JSON.stringify({ \n" +
                varList.reduce((sum, cur)  => {
                    var varName = Blockly.JavaScript.variableDB_.getName(cur.name, Blockly.Variables.NAME_TYPE);
                    return sum + "    " + varName + ": (" + varName + " !== null) ? " + varName + " : '',\n";
                }, "") + 
            "  }); \n" + 
        "}; \n\n\n" +   
        "// updates all used variables based on the payload dictionary object \n" + 
        "const updateVariables = (payload) => { \n" + 
            varList.reduce((sum, cur)  => {
                let newSum = sum;
                let varName = Blockly.JavaScript.variableDB_.getName(cur.name, Blockly.Variables.NAME_TYPE);
                let illegalNames = ["state", "start", "curPayload", "options", "summarizeVariables", "updateVariables", "sendButton", "say", "sayIn", "sendButtonIn", "payload", "axios_res", "axios", "modules"];
                if (illegalNames.includes(varName)) newSum = newSum + "  // ERROR: the name '" + varName + "' is already used\n";
                return newSum + "  " + varName + " = (payload." + varName + " !== null) ? payload." + varName + " : ''; \n";
            }, "") + 
        "}; \n\n\n" +
        codeLines.slice(codeInit).join("\n") + "\n" +  
        debugCode + 
        "\n\nmodule.exports = {\n" + 
        "  filename: '" + filename.replaceAll("'", "\\'") + "'," + ((filename.replaceAll("'", "\\'"))==="" ? " /* ERROR: missing filename */": "" ) + "\n" + 
        "  title: '" + title.replaceAll("'", "\\'") + "'," + ((filename.replaceAll("'", "\\'"))==="" ? " /* ERROR: missing title */": "" ) + "\n" +
        "  introduction: [" + ((intro === "") ? "" : ("'" + intro.replaceAll("'", "\\'").replaceAll('\n', "','")) + "'") + "],\n" + 
        "  start: " + ((addDebug) ? "debug_start" : "start") + ",\n" + 
        "  state: " + ((addDebug) ? "debug_repeat" : "repeat") + ",\n" + 
        "};\n"

        // Set the translated javascript code
        setJavascriptCode(code);

        // Get the translation of the selected block
        try {
            var messyCurCode = "";
            var curBlock = Blockly.selected;
            var messyNxtCode = "";
            var nxtBlock = curBlock.getNextBlock();
            
            // Get translation of selected block and onwards using Blockly
            if (curBlock === null) {
                messyCurCode = "";
            } else if (curBlock.type.includes('procedures')) {
                if (curBlock.type.includes('call')) {
                    messyCurCode = Blockly.JavaScript['procedures_callnoreturn'](curBlock);
                } else {
                    messyCurCode = generateDefProcedureCode(curBlock);
                }
            } else {
                var line = Blockly.JavaScript.blockToCode(curBlock);
                if (Array.isArray(line)) {
                // Value blocks return tuples of code and operator order.
                // Top-level blocks don't care about operator order.
                    line = line[0];
                }
                if (line) {
                    messyCurCode = line;
                } else {
                    messyCurCode = "";
                }
            }
            
            // Get translation of blocks after selected block using Blockly
            if (nxtBlock === null) {
                messyNxtCode = "";
            } else if (nxtBlock.type.includes('procedures')) {
                if (nxtBlock.type.includes('call')) {
                    messyNxtCode = Blockly.JavaScript['procedures_callnoreturn'](nxtBlock);
                } else {
                    messyNxtCode = generateDefProcedureCode(nxtBlock);
                }
            } else {
                var nxtLine = Blockly.JavaScript.blockToCode(nxtBlock);
                if (Array.isArray(nxtLine)) {
                    // Value blocks return tuples of code and operator order.
                    // Top-level blocks don't care about operator order.
                    nxtLine = nxtLine[0];
                }
                if (nxtLine) {
                    messyNxtCode = nxtLine;
                } else {
                    messyNxtCode = "";
                }
            }
            
            // Replace variable ids with proper variable names
            varList.forEach((varModel) => {
                // Serialize variable id
                var curId = varModel.getId().replaceAll('`', '_60');
                curId = curId.replaceAll('|', '_7C');
                curId = curId.replaceAll('%', '_25');
                curId = curId.replaceAll('^', '_5E');
                curId = curId.replaceAll('{', '_7B');
                curId = curId.replaceAll('}', '_7D');
                curId = curId.replaceAll('[', '_5B');
                curId = curId.replaceAll(']', '_5D');
                curId = curId.replaceAll(/[^\w\s]/gi, '_');
                messyCurCode = messyCurCode.replaceAll(curId, Blockly.JavaScript.variableDB_.getName(varModel.name, Blockly.Variables.NAME_TYPE));
                messyNxtCode = messyNxtCode.replaceAll(curId, Blockly.JavaScript.variableDB_.getName(varModel.name, Blockly.Variables.NAME_TYPE));
            });

            // Get only the translated code of selected block
            var lastIndex = messyCurCode.lastIndexOf(messyNxtCode);
            setSelectedCode(messyCurCode.substring(0,lastIndex));
        }
        catch(err) {
            setSelectedCode("");
        }
    }

    // Handles copying to the clipboard when in chrome and not in secure connection
    function copyToClipboard(textToCopy) {
        // navigator clipboard api needs a secure context (https)
        if (navigator.clipboard && window.isSecureContext) {
            // navigator clipboard api method'
            return navigator.clipboard.writeText(textToCopy);
        } else {
            // text area method
            let textArea = document.createElement("textarea");
            textArea.value = textToCopy;
            // make the textarea out of viewport
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                // here the magic happens
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    // Copy button handler
    let handleCopy = async e => {
        e.preventDefault();
        copyToClipboard(javascriptCode)
        .then(() => {
            setDlg("Successfully copied!");
            setShowDlg(true);
        })
        .catch(() => {
            setDlg("An error occured, please try again.");
            setShowDlg(true);
        });
        
    };

    // Logout button handler
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

    // Back button handler
    let handleBack = async e => {
        e.preventDefault();
        if (wasEdited()) {
            setShowConfirm(true);
            setStalledProcess("Back");
        } else {
            props.setPage("Programs");
        }
    };

    // Yes (on Back and changes made) button handler
    let handleYes = async e => {
        e.preventDefault();
        if (stalledProcess === "Logout") {
            props.setCurUser("");
            props.setPage("Login");
        } else {
            props.setPage("Programs");
        }
    };

    // No (on Back and changes made) button handler
    let handleNo = async e => {
        e.preventDefault();
        setShowConfirm(false);
    };

    // More button handler
    let handleMore = async e => {
        e.preventDefault();
        setShowMore(!showMore);
    };

    // Save button handler
    let handleSave = async e => {
        e.preventDefault();
        if (title.trim() === "" || filename.trim() === "") {
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
                body: JSON.stringify({user: props.curUser, id: curId, filename: filename, title: title, intro: intro, program: xml}),
            });
            let body = await response.text();
            body = JSON.parse(body);
            if (body.stat.includes("success") || body.stat.includes("Success")) {
                setCurId(body.val);
                setLastSaved(JSON.stringify({user: props.curUser, id: body.val, filename: filename, title: title, intro: intro, program: xml}));
                if (/\n\s*\/\/\s*ERROR:/mg.test(javascriptCode)) {
                    setDlg("Saved with errors.");
                } else {
                    setDlg(body.stat);
                }
            } else {
                setDlg(body.stat);
            }
            setShowDlg(true);
        }
    };

    // Save as button handler
    let handleSaveAs = async e => {
        e.preventDefault();
        if (title.trim() === "" || filename.trim() === "") {
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
                setCurId(body.val);
                setLastSaved(JSON.stringify({user: props.curUser, id: body.val, filename: filename, title: title, intro: intro, program: xml}));
                if (/\n\s*\/\/\s*ERROR:/mg.test(javascriptCode)) {
                    setDlg("Saved with errors.");
                } else {
                    setDlg(body.stat);
                }
            } else {
                setDlg(body.stat);
            }
            setShowDlg(true);
        }
    }

    // (De/Ac)tivate debug button handler
    let handleDebug = async e => {
        e.preventDefault();
        setAddDebug(!addDebug);
    }

    // Delete button handler
    let handleDelete = async e => {
        e.preventDefault();
        setShowDelete(true);
    };

    // Continue (on Delete) button handler
    let handleContinue = async e => {
        e.preventDefault();
        const response = await fetch('/delete', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({user: props.curUser, id: curId}),
        });
        let body = await response.text();
        body = JSON.parse(body);
        setShowDelete(false);
        setDlg(body.stat);
        if (body.stat !== "Success") props.setPage("Programs");
    };

    // Cancel (on Delete) button handler
    let handleCancel = async e => {
        e.preventDefault();
        setShowDelete(false);
    };

    // Loads program on selection
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
    }, [initialXml, props.curUser, props.newId]);

    return (
        <div style={{width: "100vw", overflow: "hidden"}} class="container-fluid px-0">
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
                <div style={{height: "100vh", maxHeight: "100vh"}} class="col-12 col-md-5 col-xl-4 pl-0 pr-4">
                    { (!showMore) ? 
                    <>
                        { (selectedCode === "") ?
                        <div style={{overflowX: "scroll", overflowY: "scroll", height: "82vh", maxHeight: "90vh"}} class="mb-3 px-3 mt-3">
                            {javascriptCode.split("\n").map((i,key) => {
                                if(i === "") return <div style={{fontFamily: "monospace", height: "2.5vh"}}>{' '}</div>;
                                if (/^\s*\/\/\s*ERROR:/mg.test(i) | /\s*\/\*\s*ERROR:/mg.test(i)) return <div style={{fontFamily: "monospace", height: "2.5vh", fontSize: "1.6vh", whiteSpace:"pre", color:"red"}} key={key}>{i}</div>;
                                return <div style={{fontFamily: "monospace", height: "2.5vh", fontSize: "1.6vh", whiteSpace:"pre"}} key={key}>{i}</div>;
                            })}
                        </div>
                        :
                        <div style={{overflowX: "scroll", overflowY: "scroll", height: "82vh", maxHeight: "90vh"}} class="mb-3 px-3 mt-3">
                            <div style={{fontFamily: "monospace", height: "2.5vh", fontSize: "1.6vh", whiteSpace:"pre"}} key="-1"><strong>Code generated by selected block:</strong></div>
                            {selectedCode.split("\n").map((i,key) => {
                                if(i === "") return <div style={{fontFamily: "monospace", height: "2.5vh"}}>{' '}</div>;
                                if (/^\s*\/\/\s*ERROR:/mg.test(i) | /\s*\/\*\s*ERROR:/mg.test(i)) return <div style={{fontFamily: "monospace", height: "2.5vh", fontSize: "1.6vh", whiteSpace:"pre", color:"red"}} key={key}>{i}</div>;
                                return <div style={{fontFamily: "monospace", height: "2.5vh", fontSize: "1.6vh", whiteSpace:"pre"}} key={key}>{i}</div>;
                            })}
                        </div>
                        }
                    <div style={{height: "7%"}} class="btn-toolbar d-flex justify-content-around pb-3">
                        <button style={{fontSize: "1.9vh", width: "94%", height: "100%"}} class="btn btn-outline-primary" onClick={handleCopy}>Copy</button>
                    </div>
                    </>
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
                        <button style={{fontSize: "1.9vh", width: "94%", height: "100%"}} class="btn btn-outline-primary" onClick={handleSaveAs}>Save as Copy</button>
                    </div>
                    <div style={{height: "7.3%"}} class="btn-toolbar d-flex justify-content-around pb-3">
                        <button style={{fontSize: "1.9vh", width: "94%", height: "100%"}} class={"btn btn-outline-primary" + ((addDebug) ? " active" : "")} onClick={handleDebug}>{((addDebug) ? "Deactivate " : "Activate ")}Debug Mode</button>
                    </div>
                    {(curId !== "-1") ? 
                        <div style={{height: "7.3%"}} class="btn-toolbar d-flex justify-content-around pb-3">
                            <button style={{fontSize: "1.9vh", width: "94%", height: "100%"}} class="btn btn-outline-primary" onClick={handleDelete}>Delete</button>
                        </div>
                        :
                        <></> 
                    }
                    <div style={{height: "7.3%"}} class="btn-toolbar d-flex justify-content-around pb-3">
                        <button style={{fontSize: "1.9vh", width: "94%", height: "100%"}} class="btn btn-outline-primary" onClick={handleLogout}>Logout</button>
                    </div>
                    </>
                    }
                    <div style={{height: "5%"}} class="btn-toolbar d-flex justify-content-around">
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class="btn btn-outline-primary" onClick={handleSave}>Save</button>
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class="btn btn-outline-primary" onClick={handleBack}>Back</button>
                        <button style={{fontSize: "1.9vh", width: "27%", height: "100%"}} class={"btn btn-outline-primary" + ((showMore) ? " active" : "")} onClick={handleMore}>{((showMore) ? "Less" : "More")}</button>
                    </div>
                </div>
            </div>
            :
            <>Loading workspace...</>
            }
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
            {
                (showDelete) ?
                <div style={{position:"fixed", top:"1em", right:"0", left:"0", margin:"auto", width: "30vw"}} class="alert alert-warning" role="alert">
                    <h4 class="alert-heading">Confirm Delete</h4>
                    <p>You are about to delete the {filename} program.<br/>Press continue to destroy this file.</p>
                    <hr />
                    <div class="btn-toolbar">
                        <button class="btn btn-outline-dark" onClick={handleCancel}>Cancel</button>
                        <button class="btn mx-3 btn-outline-dark" onClick={handleContinue}>Continue</button>
                    </div>
                </div>
                :
                <></>
            }
        </div>
    );
}