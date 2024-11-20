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
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Vault Dashboard</h1>
      {loading ? (
        <p>Loading vaults...</p>
      ) : (
        <div className="space-y-4">
          {vaults.length > 0 ? (
            vaults.map((vault, idx) => (
              <div key={idx} className="p-4 bg-gray-100 rounded-md shadow-sm">
                <Link
                  href={`/vaults/${vault}`}
                  className="text-blue-500 hover:underline"
                >
                  Vault {idx + 1}: {vault}
                </Link>
              </div>
            ))
          ) : (
            <p>No vaults found.</p>
          )}
        </div>
      )}
    </div>
  );
}
