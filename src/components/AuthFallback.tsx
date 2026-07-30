import { AlertTriangle, RefreshCw } from "lucide-react";

const AuthFallback = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="max-w-md text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto" />
        <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
        <p className="text-muted-foreground">
          We hit an error while loading this page. Your session is safe — try reloading.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
        >
          <RefreshCw className="w-4 h-4" /> Reload
        </button>
      </div>
    </div>
  );
};

export default AuthFallback;