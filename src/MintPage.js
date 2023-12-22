import * as React from "react";
import { useState, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Button from "@mui/material/Button";
import { GlobalContext } from "./GlobalContext";
import Web3 from "web3";
import { GenericABI } from "./ABI";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ticketContractABI, ticketContractAddress, christmasContractABI, christmasContractAddress } from "./ERC1155Contract";

export default function MintPage() {
  const { client, setAccount, account } = useContext(GlobalContext);
  // const notify = () => toast("Wow so easy!");
  const [web3, setWeb3] = useState();
  // const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  console.log("contract", contract);
  const [file, setFile] = useState();
  const [network, setNetwork] = useState("");
  const [tokenAmount, setTokenAmount] = useState(0);
  // console.log("tokenAmount: ", tokenAmount);

  // NFT metadata
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  // function getContract() {
  //   return ERC1155contractAddress;
  // }

  async function handleConnect() {
    if (window.ethereum) {
      try {
        const web3 = new Web3(Web3.givenProvider);
        await web3.givenProvider.enable();
        const accounts = await web3.eth.getAccounts();
        let network = await web3.eth.getChainId();
        // if (network !== 80001) {
        //   // if (network != 137) {
        //   await switchNetwork();
        // }
        network = await web3.eth.getChainId();
        setWeb3(web3);
        setAccount(accounts[0]);
        setNetwork(network);
      } catch (err) {
        console.log(err);
      }
    } else {
      alert("Install Metamask");
    }
  }
  // async function switchNetwork() {
  //   try {
  //     await window.ethereum.request({
  //       method: "wallet_switchEthereumChain",
  //       params: [{ chainId: "0x13881" }] // mumbai testnet
  //       // params: [{ chainId: "0x89" }] // mainnet
  //       // params: [{ chainId: web3.utils.toHex(chainId) }]
  //     });
  //     // setNetwork(137);
  //     setNetwork(80001);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  function handleFile(e) {
    setFile(e.target.files[0]);
  }
  const handleContract = (event) => {
    setContract(event.target.value);
  };

  async function handleSubmit(e) {
    console.log("network", network);
    console.log("web3", web3);
    if (!!account && !!name && !!description && file) {
      if (contract == categories[0]) {
        if (network != 80001) {
          alert("Switch to Polygon testnet");
          return;
        }
      }
      if (contract == categories[1]) {
        if (network != 5) {
          alert("Switch to Goerli testnet");
          return;
        }
      }
      try {
        console.log("Minting start...");
        let metadata;
        let mintTrx;
        let tokenUri;
        let smartContract
        // upload image
        const imageHash = await client.add(file);
        if (imageHash.path) {
          metadata = {
            name: name,
            description: description,
            image: `ipfs://${imageHash.path}`
          };
          // upload metadata
          const res = await client.add(JSON.stringify(metadata));
          if (res.path) {

            if (contract == categories[0]) {
              // get total supply and add + 1 to mint new ERC1155 token
              smartContract = new web3.eth.Contract(ticketContractABI, getContract());
              const totalSupply = await smartContract.methods.totalSupply().call();
              let newTokenId = Number(totalSupply) + 1;
              tokenUri = `https://ipfs.io/ipfs/${res.path}`;
              mintTrx = await smartContract.methods.mint(newTokenId, tokenAmount, tokenUri).send({
                from: account,
                gasLimit: 300000
              });
            } else {
              smartContract = new web3.eth.Contract(christmasContractABI, getContract());
              let priceInWei = web3.utils.toWei(price, "ether");
              mintTrx = await smartContract.methods.mint(tokenAmount, tokenUri, priceInWei).send({
                from: account,
                gasLimit: 300000
              });
            }

            if (mintTrx.status) {
              console.log("Minted Successfully: ", mintTrx.transactionHash);
              console.log("Minting end...");
              toast.success("Minted Successfully");
              // toast.success(`ERC1155 Token#${newTokenId} Minted in ${getContract()}`);
            } else {
              console.log("Minting Failed:", mintTrx.transactionHash);
              toast.error("Minting Failed!");
            }
          } else {
            toast.error("Metadata Upload Failed!");
          }
        } else {
          toast.error("Image Upload Failed!");
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      toast.warn("Connect wallet and enter fields first!");
    }
  }

  useEffect(() => {
    if (window.ethereum && account) {
      async function handleAccountChange() {
        try {
          await window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
            // console.log("new account: ", accounts[0]);
          });
        } catch (err) {
          console.log("handleAccountChange err:", err);
        }
      }
      async function handleNetworkChange() {
        try {
          await window.ethereum.on("chainChanged", (network) => {
            // if (network != 137) {
            //   if (network != 80001) {
            //   console.log("network: ", network);
            //   switchNetwork();
            // }
            setNetwork(network);
            console.log("new network: ", network);
          });
        } catch (err) {
          console.log("handleNetworkChange err:", err);
        }
      }

      handleAccountChange();
      handleNetworkChange();
    } else {
      console.log("window.ethereum or account not found");
    }
  }, [web3]);

  function handleTokenAmount(e) {
    if (e.target.value <= 0) {
      setTokenAmount(0);
    } else {
      setTokenAmount(e.target.value);
    }
    // console.log(e.target.value);
  }

  const categories = [
    "Chainblock Event Ticket",
    "Christmas Collection",
  ];
  function getContract() {
    if (contract === "Chainblock Event Ticket") {
      return ticketContractAddress;
    } else {
      return christmasContractAddress;
    }
  }

  function handlePrice(e) {
    setPrice(e.target.value);
  }

  return (
    <React.Fragment>
      <Paper
        elevation={3}
        sx={{ marginRight: "15%", marginLeft: "15%" }}
        style={{ background: "azure" }}
      >
        <ToastContainer />
        <Box sx={{ padding: 5 }}>
          <Typography variant="h3" gutterBottom sx={{ paddingBottom: 5 }}>
            MINT ERC1155 Token
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Smart Contract
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">Contract</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={contract}
                  label="contract"
                  onChange={handleContract}
                >
                  {categories.map((item) => (
                    <MenuItem value={item}>{item}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                NFT Title
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                required
                id="title"
                name="title"
                label="NFT Title..."
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>
            {/* <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                NFT Amount
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                required
                id="amount"
                name="amount"
                label="NFT Amount..."
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid> */}
            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                NFT Desc
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                id="outlined-multiline-static"
                label="NFT Description..."
                multiline
                fullWidth
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Token Amount
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                id="outlined-number"
                label="Token Amount"
                type="number"
                value={tokenAmount}
                onChange={handleTokenAmount}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            {contract == categories[1] ? <><Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Price in ETH
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                id="outlined-number"
                label="Price in ETH"
                type="number"
                value={price}
                onChange={handlePrice}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid></> : null}
            {/* <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                NFT Desc
              </InputLabel>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                required
                id="artist"
                name="artist"
                label="NFT Description..."
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
              />
            </Grid> */}

            {/*  */}

            {/* <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Author
              </InputLabel>
            </Grid> */}
            {/* <Grid item xs={12} sm={4}>
              <TextField
                required
                id="author"
                name="author"
                label="Author"
                fullWidth
                size="small"
                autoComplete="off"
                variant="outlined"
              />
            </Grid> */}

            <Grid item xs={12} sm={2}>
              <InputLabel
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontWeight: 700
                }}
              >
                Img Upload
              </InputLabel>
            </Grid>

            <Grid item xs={12} sm={3}>
              <Button>
                <UploadFileIcon />
                <input type="file" onChange={handleFile} />
              </Button>
            </Grid>




            <Grid item xs={12} sm={6} />
            <Grid item xs={12} sm={5} />
            <Grid item xs={12} sm={4}>
              {/* handleConnect */}
              {account ? (
                <Button variant="contained" onClick={() => handleSubmit()}>
                  Mint
                </Button>
              ) : (
                <Button variant="contained" onClick={() => handleConnect()}>
                  Connect Wallet
                </Button>
              )}
            </Grid>
            {/*  */}
            {/*  */}
            {/*  */}
            {/*  */}

            <Grid item xs={12} sm={5}>
              <FormControl component="fieldset">
                {/* <FormLabel component="legend">Weekdays</FormLabel> */}
                {/* <FormGroup aria-label="position">
          <FormControlLabel
            value=""
            control={<Input />}
            label="Title"
            labelPlacement="bottom"
          />

          <FormControlLabel
            value=""
            control={<Input />}
            label="Artist"
            labelPlacement="bottom"
          />
        </FormGroup> */}
                {/* <FormControlLabel
                  value="tuesday"
                  control={<Checkbox />}
                  label="Tuesday"
                  labelPlacement="bottom"
                /> */}
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </React.Fragment>
  );
}
