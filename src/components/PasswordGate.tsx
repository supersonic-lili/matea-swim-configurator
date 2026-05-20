import { useEffect, useState, type FormEvent } from "react";
import mateaLogo from "@/assets/matea-logo.png";

const PASSWORD = "marseille";
const STORAGE_KEY = "matea-gate-ok";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === PASSWORD) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setUnlocked(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  if (!ready) return null;
  if (unlocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-6">
      <img src={mateaLogo} alt="MATEA" className="w-[220px] sm:w-[280px] h-auto mb-12" />
      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col items-center">
        <input
          type="password"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(false);
          }}
          placeholder="mot de passe"
          autoFocus
          className={`w-full px-4 py-3 text-center text-base font-light bg-transparent border-b border-black/30 focus:border-black outline-none transition-all ${
            shake ? "animate-[shake_0.4s_ease-in-out]" : ""
          }`}
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        />
        {error && (
          <p className="mt-3 text-xs font-light text-red-600">mot de passe incorrect</p>
        )}
        <button
          type="submit"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-black px-8 py-3 text-sm font-light text-white transition-transform hover:scale-105"
        >
          Entrer
        </button>
      </form>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
