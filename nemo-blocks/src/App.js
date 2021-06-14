import "./App.css";
import "./customBlocks/custom_Blocks";
import React, { useState } from "react";
import { BlocklyWorkspace } from "react-blockly";
import Blockly from "blockly";

export default function App() {
  const [xml, setXml] = useState("");
  const [javascriptCode, setJavascriptCode] = useState("");
  const [curUser, setCurUser] = useState("");
  const [userField, setUserField] = useState("");
  const [passField, setPassField] = useState("");
  const [curId, setCurId] = useState(-1);
  const [newId, setNewId] = useState(-1);
  const [filename, setFilename] = useState("");
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [dlg, setDlg] = useState("");
  const [prgNames, setPrgNames] = useState({});

  const initialXml =
    `<xml xmlns="https://developers.google.com/blockly/xml">
      <block type="start" id="6_S},[q^:L,cFM/+.=gR" x="10" y="10" deletable="false"></block>
      <block type="repeat" id=";OK~g^Rs@TDIso-B]w1{" x="470" y="10" deletable="false"></block>
    </xml>`;
  const toolboxCategories = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Logic",
        colour: "#5C81A6",
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
          {
            kind: "block",
            type: "logic_compare",
          },
          {
            kind: "block",
            type: "logic_operation",
          },
          {
            kind: "block",
            type: "logic_negate",
          },
          {
            kind: "block",
            type: "logic_boolean",
          },
          {
            kind: "block",
            type: "logic_null",
          },
          {
            kind: "block",
            type: "logic_ternary",
          },
        ],
      },
      {
        kind: "category",
        name: "Loops",
        colour: "#5ba55b",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
          },
          {
            kind: "block",
            type: "controls_whileUntil",
          },
          {
            kind: "block",
            type: "controls_for",
          },
          {
            kind: "block",
            type: "controls_forEach",
          },
          {
            kind: "block",
            type: "controls_flow_statements",
          },
        ],
      },
      {
        kind: "category",
        name: "Math",
        colour: "#5b67a5",
        contents: [
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "math_arithmetic",
          },
          {
            kind: "block",
            type: "math_single",
          },
          {
            kind: "block",
            type: "math_trig",
          },
          {
            kind: "block",
            type: "math_constant",
          },
          {
            kind: "block",
            type: "math_number_property",
          },
          {
            kind: "block",
            type: "math_round",
          },
          {
            kind: "block",
            type: "math_on_list",
          },
          {
            kind: "block",
            type: "math_modulo",
          },
          {
            kind: "block",
            type: "math_constrain",
          },
          {
            kind: "block",
            type: "math_random_int",
          },
          {
            kind: "block",
            type: "math_random_float",
          },
        ],
      },
      {
        kind: "category",
        name: "Text",
        colour: "#5ba58c",
        contents: [
          {
            kind: "block",
            type: "text",
          },
          {
            kind: "block",
            type: "text_join",
          },
          {
            kind: "block",
            type: "text_append",
          },
          {
            kind: "block",
            type: "text_isEmpty",
          },
          {
            kind: "block",
            type: "text_indexOf",
          },
          {
            kind: "block",
            type: "text_charAt",
          },
          {
            kind: "block",
            type: "text_getSubstring",
          },
          {
            kind: "block",
            type: "text_changeCase",
          },
          {
            kind: "block",
            type: "text_trim",
          },
        ],
      },
      {
        kind: "category",
        name: "Lists",
        colour: "#745ba5",
        contents: [
          {
            kind: "block",
            type: "lists_create_with",
          },
          {
            kind: "block",
            type: "lists_repeat",
          },
          {
            kind: "block",
            type: "lists_length",
          },
          {
            kind: "block",
            type: "lists_isEmpty",
          },
          {
            kind: "block",
            type: "lists_indexOf",
          },
          {
            kind: "block",
            type: "lists_getIndex",
          },
          {
            kind: "block",
            type: "lists_setIndex",
          },
          {
            kind: "block",
            type: "lists_getSublist",
          },
          {
            kind: "block",
            type: "lists_split",
          },
          {
            kind: "block",
            type: "lists_sort",
          },
        ],
      },
      {
        kind: "category",
        name: "Variables",
        custom: "VARIABLE",
        colour: "#a55b80",
      },
      {
        kind: "category",
        name: "Functions",
        custom: "PROCEDURE",
        colour: "#995ba5",
      },
      {
        kind: "category",
        name: "Chat",
        colour: "#a5805b",
        contents: [
          {
            kind: "block",
            type: "say",
          },
          {
            kind: "block",
            type: "send_image",
          },
          {
            kind: "block",
            type: "send_video",
          },
          {
            kind: "block",
            type: "send_audio",
          },
          {
            kind: "block",
            type: "ask",
          },
          {
            kind: "block",
            type: "option",
          },
          {
            kind: "block",
            type: "option_only",
          },
          {
            kind: "block",
            type: "option_do",
          },
          {
            kind: "block",
            type: "option_do_only",
          },
          {
            kind: "block",
            type: "option_restart",
          },
        ],
      },
    ],
  };
  function workspaceDidChange(workspace) {
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    code = code + "module.exports = {\n" + 
    "   filename: '" + filename + "',\n" + 
    "   title: '" + title + "',\n" +
    "   introduction: ['" + ((intro === "") ? "" : intro.replaceAll('\n', "','")) + "'],\n" + 
    "   start: start,\n" + 
    "   state: state,\n" + 
    "};\n"
    setJavascriptCode(code);
  }

  let handleLogin = async e => {
    e.preventDefault();
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({pass: passField, user: userField}),
    });
    let sentUser = userField; // prevent any updating mid-send
    let body = await response.text();
    body = JSON.parse(body);
    if (body.stat === "Success!") setCurUser(body.val);
    setDlg(body.stat);
  };

  let handleCreate = async e => {
    e.preventDefault();
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

  let handleSave = async e => {
    e.preventDefault();
    if (curUser === "") {
      setDlg("Please login before saving.");
    } else {
      const response = await fetch('/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user: curUser, id: curId, filename: filename, title: title, intro: intro, program: xml}),
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.stat === "Success!") setCurId(body.val);
      setDlg(body.stat);
    }
  };

  let handleLoad = async e => {
    e.preventDefault();
    const response = await fetch('/load', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: curUser, id: newId}),
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.stat === "Success!") setPrgNames(body.val);
    setDlg(body.stat);
  };

  let handleGetPrgNames = async e => {
    e.preventDefault();
    const response = await fetch('/getPrgNames', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({user: curUser}),
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.stat === "Success!") setPrgNames(body.val);
    setDlg(body.stat);
  };

  return (
    <div style={{display: "flex", flexWrap: "wrap", width: "100%", minHeight: "100%"}}>
      <div style={{height: "100%", width: "70%"}}>
        <BlocklyWorkspace
          toolboxConfiguration={toolboxCategories}
          initialXml={initialXml}
          className="fill-height"
          style={{ minHeight: "100%", width: "100%", }}
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
      <div style={{ height: "100%", width: "30%", }}>
        <textarea
          id="code"
          rows="50"
          style={{ maxHeight: "100%", width: "100%", resize: "none", overflowX: "scroll"}}
          value={javascriptCode}
          readOnly
        ></textarea>
      </div>
      <div  style={{width: "100%"}}>
        Username: <input
          type="text"
          value={userField}
          onChange={e => setUserField(e.target.value)}
        ></input>
        Password: <input
          type="password"
          value={passField}
          onChange={e => setPassField(e.target.value)}
        ></input>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleCreate}>Create Account</button>
      </div>
      <br/><br/>
      <div style={{width: "100%"}}>
        Filename: <input
            type="text"
            value={filename}
            onChange={e => setFilename(e.target.value)}
          ></input>
        Title: <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
          ></input>
        Introduction: <textarea
            value={intro}
            onChange={e => setIntro(e.target.value)}
          ></textarea>
          <button onClick={handleSave}>Save</button>
        </div>
        <div style={{width: "100%"}}>
          {(Object.entries(prgNames).length === 0) ? 
            <select onClick={handleGetPrgNames}><option value="-1" selected disabled hidden>None</option><option disabled>No program saved</option></select> : 
            <select onClick={handleGetPrgNames}><option value="-1" selected disabled hidden>None</option>{Object.entries(prgNames).map((pair) => <option value={'"' + pair[0] + '"'}>{pair[1]}</option>)}</select>
          }
          <button onClick={handleLoad}>Load</button>
        </div>
        <br/><br/>
        <div style={{width: "100%"}}>{(curUser === "") ? "Not logged in. \n" : "Logged in as \n" + curUser}</div>
        <div style={{width: "100%"}}>{dlg}</div>
    </div>
  );
}
