import { ethers } from "ethers";

// Connect to Ethereum using the RPC URL from .env.local
const provider = new ethers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_NETWORK_RPC_URL
);

// Function to get the signer, which is often the user's wallet connection
export async function getSigner() {
  // Ensure that MetaMask is available and connected
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" }); // Request accounts if not already connected
    return provider.getSigner();
  } else {
    throw new Error("MetaMask is not available. Please install MetaMask.");
  }
}

export default provider;
