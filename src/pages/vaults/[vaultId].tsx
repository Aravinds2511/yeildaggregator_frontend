import { useRouter } from "next/router";
import VaultDetails from "../../components/VaultDetails";

export default function VaultDetailPage() {
  const router = useRouter();
  const { vaultId } = router.query;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <VaultDetails vaultId={vaultId as string} />
    </div>
  );
}
