// src/utils/VaultFactory.ts
import { ethers } from "ethers";
import { VaultFactoryABI } from "../abis/VaultFactory.json";
import provider, { getSigner } from "./web3";

const vaultFactoryAddress = process.env.NEXT_PUBLIC_FACTORY_CONTRACT_ADDRESS!;
console.log("VaultFactory Contract Address:", vaultFactoryAddress);

// Initialize the VaultFactory contract with the awaited signer
async function getVaultFactoryContract() {
  const web3Provider = new ethers.BrowserProvider(window.ethereum);
  async function getSigner() {
    return web3Provider.getSigner();
  }
  const signer = await getSigner(); // Ensure getSigner is awaited
  return new ethers.Contract(vaultFactoryAddress, VaultFactoryABI, signer);
}

// Example functions to interact with VaultFactory

export async function deployVault(asset: string, name: string, symbol: string) {
  const vaultFactoryContract = await getVaultFactoryContract();
  const tx = await vaultFactoryContract.deployVault(asset, name, symbol);
  return tx.wait();
}

export async function getVaultCount(): Promise<number> {
  try {
    const vaultFactoryContract = await getVaultFactoryContract();
    const vaultCount = await vaultFactoryContract.getVaultCount();
    return Number(vaultCount); // Convert BigNumber to number if needed
  } catch (error) {
    console.error("Error fetching vault count:", error);
    throw error; // Rethrow or handle error as needed
  }
}

export async function getVault(index: number): Promise<string> {
  const vaultFactoryContract = await getVaultFactoryContract();
  return await vaultFactoryContract.getVault(index);
}
