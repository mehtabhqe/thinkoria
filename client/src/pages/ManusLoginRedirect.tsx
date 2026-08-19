import { useEffect } from "react";
import { startLogin } from "@/const";

export default function ManusLoginRedirect() {
  useEffect(() => {
    startLogin();
  }, []);

  return (
    <main className="oauth-redirect-overlay" aria-live="polite" aria-busy="true">
      <div className="oauth-redirect-card">
        <div className="oauth-redirect-spinner" aria-hidden="true" />
        <div>
          <p className="oauth-redirect-title">Thinkoria secure access</p>
          <p className="oauth-redirect-message">Opening the secure login page…</p>
        </div>
      </div>
    </main>
  );
}
