const GenericABI = [
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256"
      },
      {
        components: [
          {
            internalType: "address payable",
            name: "recipient",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        internalType: "struct ERC721Base.Fee[]",
        name: "_fees",
        type: "tuple[]"
      },
      {
        internalType: "string",
        name: "tokenURI",
        type: "string"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      }
    ],
    name: "mint",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    payable: false,
    stateMutability: "view",
    type: "function"
  }
];

module.exports = { GenericABI };
