/********************************************************************************************/
/* App.js                                                                                   */
/*__________________________________________________________________________________________*/
/* Main Component. Contains Page components that handle which component is being displayed. */
/* Contains global state variables which are shared between components in differant pages.  */
/********************************************************************************************/

import "./App.css";
import "./customBlocks/custom_Blocks";
import React, { useState } from "react";
import Page from "./Page";
import Login from "./Login";
import Programs from "./Programs";
import Workspace from "./Workspace";
import Documentation from "./Documentation";
import Feedback from "./Feedback";
import Import from "./Import";

export default function App() {
  const [curUser, setCurUser] = useState("");
  const [newId, setNewId] = useState(-1);
  const [page, setPage] = useState("Login");

  return (
    <div style={{display: "flex", flexWrap: "wrap", width: "100%", minHeight: "100%"}}>
      <Page target="Login" current={page}>
        <Login shown={"Login"===page} setCurUser={setCurUser} setPage={setPage}></Login>
      </Page>

      <Page target="Programs" current={page}>
        <Programs shown={"Programs"===page} setCurUser={setCurUser} curUser={curUser} setNewId={setNewId} setPage={setPage}></Programs>
      </Page>

      <Page target="Workspace" current={page}>
        <Workspace shown={"Workspace"===page} setCurUser={setCurUser} curUser={curUser} newId={newId} setPage={setPage}></Workspace>
      </Page>

      <Page target="Documentation" current={page}>
        <Documentation shown={"Documentation"===page} curUser={curUser} setPage={setPage}></Documentation>
      </Page>

      <Page target="Feedback" current={page}>
        <Feedback shown={"Feedback"===page} curUser={curUser} setPage={setPage}></Feedback>
      </Page>

      <Page target="Import" current={page}>
        <Import shown={"Import"===page} curUser={curUser} setPage={setPage}></Import>
      </Page>
    </div>
  );
}
