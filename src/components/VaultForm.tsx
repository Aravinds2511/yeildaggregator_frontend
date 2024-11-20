import { useState } from "react";
import { deployVault } from "../utils/VaultFactory";

export default function VaultForm() {
  const [asset, setAsset] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const txReceipt = await deployVault(asset, name, symbol);
      alert(`Vault Created: ${txReceipt.transactionHash}`);
      setAsset("");
      setName("");
      setSymbol("");
    } catch (error) {
      console.error(error);
      alert("Vault creation failed");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow-md rounded-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Vault</h2>
      <input
        className="w-full mb-3 p-2 border border-gray-300 rounded-md"
        placeholder="Asset Address"
        value={asset}
        onChange={(e) => setAsset(e.target.value)}
      />
      <input
        className="w-full mb-3 p-2 border border-gray-300 rounded-md"
        placeholder="Vault Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full mb-3 p-2 border border-gray-300 rounded-md"
        placeholder="Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
      >
        Create Vault
      </button>
    </form>
  );
}
