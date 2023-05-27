import "./styles.css";
// import MintForm from "./MintForm";
import { GlobalContext } from "./GlobalContext";
import React, { useState } from "react";
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import MintPage from "./MintPage.js";
import DarkAppBar from "./DarkAppBar";
/* configure Infura auth settings */
const projectId = "2Q44ezx9rSiGZgfYJ2JKZj3gApQ";
const projectSecret = "18439b3df79b8775f049ee31de2e6b0a";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

/* Create an instance of the client */
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth
  }
});

export default function App() {
  const [account, setAccount] = useState("");
  return (
    <GlobalContext.Provider value={{ client, account, setAccount }}>
      <div className="App">
        {/* <MintForm /> */}
        <DarkAppBar />
        <br />
        <MintPage />
      </div>
    </GlobalContext.Provider>
  );
}
