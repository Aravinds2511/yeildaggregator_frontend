// src/components/ConnectWallet.tsx

import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function ConnectWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        await web3Provider.send("eth_requestAccounts", []);
        async function getSigner() {
          return web3Provider.getSigner();
        }
        const signer = await getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
      } catch (error) {
        console.error("User denied account access or error occurred", error);
      }
    } else {
      alert("Please install MetaMask to use this feature!");
    }
  };

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (typeof window.ethereum !== "undefined") {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setProvider(web3Provider);
          setAddress(accounts[0]);
        }
      }
    };
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="p-4">
      {address ? (
        <div className="flex items-center space-x-2">
          <span className="text-green-600 font-semibold">Connected:</span>
          <span className="text-gray-800">
            {/* {address.slice(0, 6)}...{address.toString().slice(-4)} */}
          </span>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}
