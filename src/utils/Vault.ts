import { ethers } from "ethers";
import { VaultABI } from "../abis/Vault.json";

/**
 * Returns a contract instance of a specific Vault contract.
 * @param vaultAddress - The address of the deployed Vault contract
 * @param signerOrProvider - Either a signer for transactions or a provider for read-only access
 */
export function getVaultContract(
  vaultAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider
) {
  return new ethers.Contract(vaultAddress, VaultABI, signerOrProvider);
}
