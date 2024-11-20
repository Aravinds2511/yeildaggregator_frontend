import Dashboard from "../components/Dashboard";
import VaultForm from "../components/VaultForm";
import ConnectWallet from "../components/ConnectWallet";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-end p-4">
        <ConnectWallet />
      </header>
      <h1 className="text-3xl font-bold text-center mb-8">
        Vault Factory Dashboard
      </h1>
      <VaultForm />
      <Dashboard />
    </div>
  );
}
