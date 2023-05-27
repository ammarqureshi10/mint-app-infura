import { useContext } from "react";
import { GlobalContext } from "./GlobalContext";

export default async function UploadMetadata(metadata) {
  // Upload metadata to IPFS
  // return hash, to use in NFT mint function

  const client = useContext(GlobalContext);

  client
    .add(metadata)
    .then(function (res) {
      console.log("res: ", res);
    })
    .catch(function (err) {
      console.log("err: ", err);
    });
}
