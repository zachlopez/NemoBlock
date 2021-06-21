import "./App.css";
import "./customBlocks/custom_Blocks";
import React, { useState } from "react";
import Page from "./Page";
import Login from "./Login";
import Programs from "./Programs";
import Workspace from "./Workspace";

export default function App() {
  const [curUser, setCurUser] = useState("");
  const [newId, setNewId] = useState(-1);
  const [page, setPage] = useState("Login");

  return (
    <div style={{display: "flex", flexWrap: "wrap", width: "100%", minHeight: "100%"}}>
      <Page target="Login" current={page}>
        <Login setCurUser={setCurUser} setPage={setPage}></Login>
      </Page>

      <Page target="Programs" current={page}>
        <Programs setCurUser={setCurUser} curUser={curUser} setNewId={setNewId} setPage={setPage}></Programs>
      </Page>

      <Page target="Workspace" current={page}>
        <Workspace setCurUser={setCurUser} curUser={curUser} newId={newId} setPage={setPage}></Workspace>
      </Page>
    </div>
  );
}
