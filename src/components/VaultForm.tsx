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
    <div className="p-6 bg-gradient-to-r from-purple-900 via-black to-purple-800 text-white rounded-lg shadow-xl max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-4 text-center">Create New Vault</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Asset Address"
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Vault Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="text"
          placeholder="Symbol"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-800 hover:bg-purple-600 text-white py-2 rounded-md transition"
        >
          Create Vault
        </button>
      </form>
    </div>
  );
}
