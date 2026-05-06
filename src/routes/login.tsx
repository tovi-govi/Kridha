import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — Kridha" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      navigate({ to: "/" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate({ to: "/" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    }
  }

  if (user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 text-center">
          <h1 className="text-2xl font-bold">Signed in</h1>
          <p className="mt-2 text-muted-foreground text-sm">{user.email}</p>
          <div className="mt-6 flex flex-col gap-3">
            <Link to="/" className="rounded-full bg-primary text-primary-foreground py-2 font-semibold">Go home</Link>
            <button onClick={signOut} className="rounded-full border border-border py-2 font-semibold">Sign out</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="max-w-sm w-full bg-card border border-border rounded-2xl p-8 shadow-soft">
        <h1 className="text-2xl font-bold">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to track your bookings.</p>

        <button onClick={handleGoogle} className="mt-6 w-full rounded-full border border-border py-2.5 font-semibold hover:bg-muted transition">
          Continue with Google
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm" />
          {error && <p className="text-xs text-destructive">{error}</p>}
          <button disabled={loading} type="submit" className="w-full rounded-full bg-primary text-primary-foreground py-2.5 font-semibold disabled:opacity-60">
            {loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-sm text-muted-foreground hover:text-foreground">
          {mode === "signin" ? "Need an account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
