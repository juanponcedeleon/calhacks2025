import React from "react";

type Profile = { name?: string; imageUrl?: string };
type AuthState = {
  address: string | null;
  loading: boolean;
  login: (profile?: Profile) => void;
  logout: () => void;
  profile: Profile | null;
};

const Ctx = React.createContext<AuthState>({
  address: null, loading: true, login: () => {}, logout: () => {}, profile: null,
});

const KEY = "demo_auth";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = React.useState<string | null>(null);
  const [profile, setProfile] = React.useState<Profile | null>(null);
  const [loading, setLoading] = React.useState(true);

  

  React.useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const { address, profile } = JSON.parse(raw);
      setAddress(address);
      setProfile(profile ?? null);
    }
    setLoading(false);
  }, []);

  const login = (p?: Profile) => {
    // mock zkLogin: mint a fake address + optional profile
    const addr =
      "0x" + Array.from(crypto.getRandomValues(new Uint8Array(20)))
        .map(b => b.toString(16).padStart(2,"0")).join("");
    const prof = p ?? { name: "Demo User" };
    localStorage.setItem(KEY, JSON.stringify({ address: addr, profile: prof }));
    setAddress(addr);
    setProfile(prof);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
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
