import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, ADMIN_EMAILS } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Kridha" }] }),
});

type Row = {
  id: string;
  name?: string; phone?: string; email?: string;
  course?: string; preferredTime?: string; message?: string;
  uid?: string | null;
  createdAt?: { seconds: number } | null;
};

function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));
        setRows(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) })));
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      }
    })();
  }, [isAdmin]);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-sm w-full text-center bg-card border border-border rounded-2xl p-8">
          <h1 className="text-xl font-bold">Admin access</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please sign in to continue.</p>
          <Link to="/login" className="mt-5 inline-block rounded-full bg-primary text-primary-foreground px-5 py-2 font-semibold">Sign in</Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-sm w-full text-center bg-card border border-border rounded-2xl p-8">
          <h1 className="text-xl font-bold">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as {user.email}. Add this email to <code>ADMIN_EMAILS</code> in <code>src/lib/firebase.ts</code> to grant access.
          </p>
          <button onClick={signOut} className="mt-5 rounded-full border border-border px-5 py-2 font-semibold">Sign out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
          <div>
            <h1 className="font-bold">Bookings</h1>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 lg:px-8 py-8">
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        {!rows ? (
          <p className="text-muted-foreground">Loading bookings…</p>
        ) : rows.length === 0 ? (
          <p className="text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  {["When", "Name", "Phone", "Email", "Course", "Preferred", "Notes"].map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : "—"}
                    </td>
                    <td className="px-3 py-2">{r.name}</td>
                    <td className="px-3 py-2">{r.phone}</td>
                    <td className="px-3 py-2">{r.email}</td>
                    <td className="px-3 py-2">{r.course}</td>
                    <td className="px-3 py-2">{r.preferredTime}</td>
                    <td className="px-3 py-2 max-w-xs truncate" title={r.message}>{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
