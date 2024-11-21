import Dashboard from "../components/Dashboard";
import VaultForm from "../components/VaultForm";
import ConnectWallet from "../components/ConnectWallet";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <header className="flex justify-end p-4">
        <ConnectWallet />
      </header>
      <h1 className="text-4xl text-white font-bold text-center mb-8">
        Vault Factory Dashboard
      </h1>
      <div className="space-y-10">
        <VaultForm />
        <Dashboard />
      </div>
    </div>
  );
}
