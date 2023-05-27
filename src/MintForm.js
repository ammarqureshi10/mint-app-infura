import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "./GlobalContext";
// import UploadMetadata from "./UploadMetadata";

const MintForm = () => {
  const client = useContext(GlobalContext);
  const [account, setAccount] = useState("0x");
  const [contract, setContract] = useState("");
  const [file, setFile] = useState();

  // NFT data
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  // const [image, setImage] = useState("");

  function handleFile(e) {
    setFile(e.target.files[0]);
  }
  async function handleSubmit(e) {
    if (!!account && !!name && !!description && file) {
      try {
        e.preventDefault();
        // upload image
        const imageHash = await client.add(file);
        console.log("imageHash: ", imageHash.path);
        const metadata = {
          name: name,
          description: description,
          image: `ipfs://${imageHash.path}`
        };
        if (imageHash.path) {
          // upload metadata
          const res = await client.add(JSON.stringify(metadata));
          if (res.path) {
            console.log("metadata: ", res.path);
          } else {
            console.error("metadata upload unsuccess");
          }
        } else {
          console.error("Image upload unsuccess!");
        }
      } catch (err) {
        e.preventDefault();
        console.log("err: ", err);
      }
    } else {
      e.preventDefault();
      alert("handleSubmit: Account not connected");
    }
  }

  return (
    <>
      <h1>NFT Mint App</h1>
      <button>Connect Wallet </button>
      <br />
      <hr />
      <br />
      {/* <label>Hello: <button>hello</button></label> */}
      <center>
        <form
          onSubmit={handleSubmit}
          // style={{ borderStyle: "groove" /* height: "100px", width: "30%" */ }}
        >
          <label>
            <b>{`Select Contract: `}</b>
          </label>
          <select onChange={(e) => setContract(e.target.value)}>
            <option value="none">none</option>
            <option value="art">ART</option>
            <option value="soccer">SOCCER</option>
            <option value="fashion">FASHION</option>
          </select>
          <br />
          <br />
          <label>
            {`NFT Name:`}
            <input
              type="text"
              placeholder="Enter NFT Title..."
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <br />
          <br />
          <label>
            {`NFT Description:`}
            {/* <input
              type="text"
              placeholder=""
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            /> */}
            <textarea
              placeholder="Enter NFT Description..."
              onChange={(e) => setDescription(e.target.value)}
              id="w3review"
              name="w3review"
              rows="4"
              cols="50"
            />
          </label>
          <br />
          <br />
          <label>
            {`NFT Image:`}
            <input
              id="imageUpload"
              type="file"
              required
              // value={image}
              // onChange={(e) => setImage(e.target.value)}
              onChange={handleFile}
            />
          </label>
          <br />
          <br />

          <input type="submit" />
        </form>
        <br />
        <br />
        <br />
        {/* <form onSubmit={onSubmitHandler}>
          <label for="file-upload" class="custom-file-upload">
            Select File
          </label>
          <input id="file-upload" type="file" name="file" />
          <button className="button" type="submit">
            Upload file
          </button>
        </form> */}
      </center>
    </>
  );
};
export default MintForm;
