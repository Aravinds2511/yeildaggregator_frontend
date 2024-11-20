import { ethers } from "ethers";

// Function to get an ERC20 token contract instance
export const getTokenContract = (
  tokenAddress: string,
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  const abi = [
    "function approve(address spender, uint256 amount) public returns (bool)",
    "function allowance(address owner, address spender) public view returns (uint256)",
  ];
  return new ethers.Contract(tokenAddress, abi, signerOrProvider);
};
