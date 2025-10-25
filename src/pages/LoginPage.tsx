import { motion } from "framer-motion";
import { Gavel, LogIn } from "lucide-react";
import { useAuth } from "@/context/MockAuth";

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <main className="min-h-screen grid place-items-center px-5">
      <motion.div className="card w-full max-w-md text-center" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mx-auto mb-4 inline-flex rounded-xl bg-white/10 p-3">
          <Gavel className="h-6 w-6 text-purple-400" />
        </div>
        <h1 className="text-3xl font-extrabold">Sign in to Sui Auction House</h1>
        <p className="mt-2 text-white/70">
          Demo mode: “Continue with Google (zkLogin)” simulates a zkLogin and takes you to the app.
        </p>

        <button
          className="btn-primary mt-6 w-full justify-center"
          onClick={() => { login({ name: "Demo User" }); window.location.replace("/app"); }}
        >
          <LogIn className="h-5 w-5" />
          Continue with Google (zkLogin)
        </button>

        <p className="mt-4 text-xs text-white/60">
          This is a front-end demonstration. Real zkLogin/Prisma can be plugged in later.
        </p>
      </motion.div>
    </main>
  );
}
