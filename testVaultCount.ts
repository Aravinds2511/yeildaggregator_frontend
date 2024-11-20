// testVaultCount.ts
const { ethers } = require("ethers");
const VaultFactoryABI = [
  { type: "constructor", inputs: [], stateMutability: "nonpayable" },
  {
    type: "function",
    name: "deployVault",
    inputs: [
      {
        name: "asset",
        type: "address",
        internalType: "contract ERC20",
      },
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
    ],
    outputs: [
      { name: "vault", type: "address", internalType: "contract Vault" },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getVault",
    inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "contract Vault" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultCount",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultFromUnderlying",
    inputs: [
      {
        name: "underlying",
        type: "address",
        internalType: "contract ERC20",
      },
      { name: "name", type: "string", internalType: "string" },
      { name: "symbol", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "address", internalType: "contract Vault" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isVaultDeployed",
    inputs: [
      { name: "vault", type: "address", internalType: "contract Vault" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [{ name: "newOwner", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "vaults",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [{ name: "", type: "address", internalType: "contract Vault" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VaultCreated",
    inputs: [
      {
        name: "creator",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "vaultAddress",
        type: "address",
        indexed: false,
        internalType: "contract Vault",
      },
      {
        name: "asset",
        type: "address",
        indexed: false,
        internalType: "contract IERC20",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "InvalidParameters", inputs: [] },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [{ name: "owner", type: "address", internalType: "address" }],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [{ name: "account", type: "address", internalType: "address" }],
  },
  { type: "error", name: "ZeroAddress", inputs: [] },
];

const vaultFactoryAddress = "0x8ccEf903FDe652488Aa64F543134B682C5dcBA45";
const provider = new ethers.JsonRpcProvider(
  "https://polygon-amoy.infura.io/v3/106c2852bbe14121a6d9467b66177318"
);

async function testVaultCount() {
  try {
    const contract = new ethers.Contract(
      vaultFactoryAddress,
      VaultFactoryABI,
      provider
    );
    const vaultCount = await contract.getVaultCount();
    console.log("Vault Count:", vaultCount.toString());
  } catch (error) {
    console.error("Error:", error);
  }
}

testVaultCount();
