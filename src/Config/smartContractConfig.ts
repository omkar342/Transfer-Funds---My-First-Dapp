export const CONTRACT_ADDRESS = "0xCE75F0b107Ce7B99108436D360db70B751aD9EAd";

export const CONTRACT_ABI = [
  {
    inputs: [],
    name: "numOfFunders",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
    constant: true,
  },
  {
    stateMutability: "payable",
    type: "receive",
    payable: true,
  },
  {
    inputs: [],
    name: "transfer",
    outputs: [],
    stateMutability: "payable",
    type: "function",
    payable: true,
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "withdrawAmount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
