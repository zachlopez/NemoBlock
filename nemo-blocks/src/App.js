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
        <Login shown={"Login"===page} setCurUser={setCurUser} setPage={setPage}></Login>
      </Page>

      <Page target="Programs" current={page}>
        <Programs shown={"Programs"===page} setCurUser={setCurUser} curUser={curUser} setNewId={setNewId} setPage={setPage}></Programs>
      </Page>

      <Page target="Workspace" current={page}>
        <Workspace shown={"Workspace"===page} setCurUser={setCurUser} curUser={curUser} newId={newId} setPage={setPage}></Workspace>
      </Page>
    </div>
  );
}
