import { useEffect, useState } from "react";
import Link from "next/link";
import { getVaultCount, getVault } from "../utils/VaultFactory";

export default function Dashboard() {
  const [vaults, setVaults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const count = await getVaultCount();
        const vaultAddresses = await Promise.all(
          Array.from({ length: count }, (_, i) => getVault(i))
        );
        setVaults(vaultAddresses);
      } catch (error) {
        console.error("Error fetching vaults:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchVaults();
  }, []);

  return (
    <div className="p-8 mt-8 bg-gradient-to-r from-gray-800 via-black to-gray-900 text-white rounded-lg shadow-xl">
      <h1 className="text-4xl font-bold mb-6 text-center">Vault Dashboard</h1>
      {loading ? (
        <p className="text-center text-xl text-gray-400 animate-pulse">
          Loading vaults...
        </p>
      ) : vaults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault, idx) => (
            <div
              key={idx}
              className="p-4 bg-gray-800 hover:bg-gray-700 rounded-lg shadow-md transition transform hover:scale-105"
            >
              <h2 className="text-lg font-semibold text-blue-400">
                Vault {idx + 1}
              </h2>
              <p className="text-gray-400">{vault}</p>
              <Link
                href={`/vaults/${vault}`}
                className="mt-2 inline-block bg-blue-600 hover:bg-blue-500 text-white py-1 px-3 rounded-md transition"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-400">No vaults found.</p>
      )}
    </div>
  );
}
