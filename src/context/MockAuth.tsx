import React from "react";

type AuthState = {
  address: string | null;
  loading: boolean;
  login: (profile?: { name?: string; imageUrl?: string }) => void;
  logout: () => void;
  profile: { name?: string; imageUrl?: string } | null;
};

const Ctx = React.createContext<AuthState>({
  address: null,
  loading: true,
  login: () => {},
  logout: () => {},
  profile: null,
});

const KEY = "demo_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<{ name?: string; imageUrl?: string } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const { address, profile } = JSON.parse(raw);
        setAddress(address);
        setProfile(profile ?? null);
      }
    } catch (e) {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = (p?: { name?: string; imageUrl?: string }) => {
    const array = new Uint8Array(20);
    if (typeof crypto !== "undefined" && (crypto as any).getRandomValues) {
      (crypto as any).getRandomValues(array);
    } else {
      for (let i = 0; i < array.length; i++) array[i] = Math.floor(Math.random() * 256);
    }
    const addr = "0x" + Array.from(array).map((b) => b.toString(16).padStart(2, "0")).join("");
    const prof = p ?? { name: "Demo User" };
    try { localStorage.setItem(KEY, JSON.stringify({ address: addr, profile: prof })); } catch {}
    setAddress(addr);
    setProfile(prof);
  };

  const logout = () => {
    try { localStorage.removeItem(KEY); } catch {}
    setAddress(null);
    setProfile(null);
  };

  return (
    <Ctx.Provider value={{ address, loading, login, logout, profile }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() { return React.useContext(Ctx); }

export function Protected({ children }: { children: React.ReactNode }) {
  const { address, loading } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center"><div className="card">Loading…</div></div>;
  if (!address) { window.location.replace("/login"); return null; }
  return <>{children}</>;
}
