import { useEffect, useState } from "react";
import { getVaultContract } from "../utils/Vault";
import { getTokenContract } from "../utils/Token";
import provider from "../utils/web3";
import { ethers } from "ethers";

export default function VaultDetails({ vaultId }: { vaultId: string | null }) {
  const [vault, setVault] = useState<any | null>(null); // Holds the contract instance once initialized
  const [owner, setOwner] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [totalAssets, setTotalAssets] = useState<string>("0");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [addStrategyAddress, setAddStrategyAddress] = useState(""); // Separate state for adding strategy
  const [removeStrategyAddress, setRemoveStrategyAddress] = useState(""); // Separate state for removing strategy
  const [loading, setLoading] = useState({
    deposit: false,
    withdraw: false,
    addStrategy: false,
    removeStrategy: false,
    harvest: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [userBalanceWithProfit, setUserBalanceWithProfit] =
    useState<string>("0");

  useEffect(() => {
    const initializeVault = async () => {
      if (!vaultId) return;
      try {
        // Obtain a provider from the user's browser (e.g., MetaMask)
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();

        // Create a contract instance connected to the signer
        const contract = getVaultContract(vaultId, signer);
        setVault(contract);
      } catch (err) {
        console.error("Failed to initialize contract:", err);
        setError("Invalid vault address.");
      }
    };

    initializeVault();
  }, [vaultId]);

  useEffect(() => {
    const initialize = async () => {
      if (!vault) return; // Only proceed if the vault contract is initialized

      try {
        const ownerAddress = await vault.owner();
        setOwner(ownerAddress);

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await web3Provider.getSigner();

        const signerAddress = await signer.getAddress();
        setUserAddress(signerAddress);

        const total = await vault.totalAssets();
        setTotalAssets(ethers.formatUnits(total, 18));

        try {
          const balanceWithProfit = await vault.userUnderlyingBalanceWithProfit(
            signerAddress
          );
          setUserBalanceWithProfit(ethers.formatUnits(balanceWithProfit, 18));
        } catch (error) {
          setUserBalanceWithProfit("0");
        }
      } catch (error) {
        console.error("Initialization error:", error);
        setError("Failed to load vault details. Check your wallet connection.");
      }
    };

    initialize();
  }, [vault]);

  const isOwner = owner && userAddress && owner === userAddress;

  const approveTokens = async (amount: string) => {
    if (!vault || !userAddress) {
      setError("Vault address or user address is missing.");
      return;
    }
    try {
      const tokenAddress: string = await vault.asset();
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const tokenContract = getTokenContract(tokenAddress, signer);

      const parsedAmount = ethers.parseUnits(amount, 18);
      const tx = await tokenContract.approve(vaultId, parsedAmount);
      await tx.wait();
      console.log("Approval successful");
    } catch (error) {
      console.error("Approval error:", error);
      setError("Failed to approve tokens. Check your wallet connection.");
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || !vault) return;
    setLoading((prev) => ({ ...prev, deposit: true }));
    try {
      const amount = ethers.parseUnits(depositAmount, 18);

      const tokenAddress: string = await vault.asset();
      const tokenContract = getTokenContract(tokenAddress, provider);

      const allowance = await tokenContract.allowance(userAddress, vaultId);
      if (allowance < amount) {
        await approveTokens(depositAmount);
      }

      const tx = await vault["deposit(uint256,address)"](amount, userAddress);
      await tx.wait();
      console.log("Deposit successful");
    } catch (error) {
      console.error("Deposit error:", error);
      setError("Failed to deposit. Check your wallet balance and approval.");
    } finally {
      setLoading((prev) => ({ ...prev, deposit: false }));
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || !vault) return;
    setLoading((prev) => ({ ...prev, withdraw: true }));
    try {
      const amount = ethers.parseUnits(withdrawAmount, 18);
      const tx = await vault.withdraw(amount, userAddress, userAddress);
      await tx.wait();
      const updatedTotalAssets = await vault.totalAssets();
      setTotalAssets(ethers.formatUnits(updatedTotalAssets, 18));
    } catch (error) {
      console.error("Withdraw error:", error);
      setError("Failed to withdraw. Check your balance in the vault.");
    } finally {
      setLoading((prev) => ({ ...prev, withdraw: false }));
    }
  };

  const handleHarvest = async () => {
    if (!isOwner || !vault) return;
    setLoading((prev) => ({ ...prev, harvest: true }));
    try {
      const tx = await vault.harvest();
      await tx.wait();
      const updatedTotalAssets = await vault.totalAssets();
      setTotalAssets(ethers.formatUnits(updatedTotalAssets, 18));
    } catch (error) {
      console.error("Harvest error:", error);
      setError("Failed to harvest rewards.");
    } finally {
      setLoading((prev) => ({ ...prev, harvest: false }));
    }
  };

  const handleAddStrategy = async () => {
    if (!isOwner || !addStrategyAddress || !vault) return;
    setLoading((prev) => ({ ...prev, addStrategy: true }));
    try {
      const tx = await vault.addStrategy(addStrategyAddress);
      await tx.wait();
      console.log("Strategy added successfully");
    } catch (error) {
      console.error("Add strategy error:", error);
      setError("Failed to add strategy. Ensure the address is valid.");
    } finally {
      setLoading((prev) => ({ ...prev, addStrategy: false }));
    }
  };

  const handleRemoveStrategy = async () => {
    if (!isOwner || !removeStrategyAddress || !vault) return;
    setLoading((prev) => ({ ...prev, removeStrategy: true }));
    try {
      const tx = await vault.removeStrategy(removeStrategyAddress);
      await tx.wait();
      console.log("Strategy removed successfully");
    } catch (error) {
      console.error("Remove strategy error:", error);
      setError("Failed to remove strategy. Ensure the strategy is active.");
    } finally {
      setLoading((prev) => ({ ...prev, removeStrategy: false }));
    }
  };

  if (!vaultId) {
    return (
      <div className="text-red-500">
        Vault address is invalid or not provided.
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Vault Details for {vaultId}
      </h2>
      <p className="text-gray-600">
        Total Assets in Vault: {totalAssets} tokens
      </p>
      <p className="text-gray-600">Owner: {owner}</p>
      <p className="text-gray-600">Your Address: {userAddress}</p>
      <p className="text-gray-600">
        Your Balance with Profit: {userBalanceWithProfit} tokens
      </p>

      {error && <div className="text-red-500">{error}</div>}

      <div className="mt-4 space-y-4">
        {/* Deposit */}
        <div>
          <input
            type="text"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="Amount to Deposit"
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleDeposit}
            disabled={loading.deposit}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {loading.deposit ? "Processing..." : "Deposit"}
          </button>
        </div>

        {/* Withdraw */}
        <div>
          <input
            type="text"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            placeholder="Amount to Withdraw"
            className="p-2 border rounded w-full mb-2"
          />
          <button
            onClick={handleWithdraw}
            disabled={loading.withdraw}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            {loading.withdraw ? "Processing..." : "Withdraw"}
          </button>
        </div>

        {/* Add Strategy (Owner only) */}
        {isOwner && (
          <div>
            <input
              type="text"
              value={addStrategyAddress}
              onChange={(e) => setAddStrategyAddress(e.target.value)}
              placeholder="Strategy Contract Address to Add"
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={handleAddStrategy}
              disabled={loading.addStrategy}
              className="bg-green-500 text-white py-2 px-4 rounded"
            >
              {loading.addStrategy ? "Processing..." : "Add Strategy"}
            </button>
          </div>
        )}

        {/* Remove Strategy (Owner only) */}
        {isOwner && (
          <div>
            <input
              type="text"
              value={removeStrategyAddress}
              onChange={(e) => setRemoveStrategyAddress(e.target.value)}
              placeholder="Strategy Contract Address to Remove"
              className="p-2 border rounded w-full mb-2"
            />
            <button
              onClick={handleRemoveStrategy}
              disabled={loading.removeStrategy}
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              {loading.removeStrategy ? "Processing..." : "Remove Strategy"}
            </button>
          </div>
        )}

        {/* Harvest (Owner only) */}
        {isOwner && (
          <button
            onClick={handleHarvest}
            disabled={loading.harvest}
            className="bg-purple-500 text-white py-2 px-4 rounded"
          >
            {loading.harvest ? "Processing..." : "Harvest Rewards"}
          </button>
        )}
      </div>
    </div>
  );
}
