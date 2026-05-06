import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db, ADMIN_EMAILS } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Download, Users, BookOpen, TrendingUp, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Kridha" }] }),
});

type Row = {
  id: string;
  name?: string; phone?: string; email?: string;
  course?: string; message?: string;
  uid?: string | null;
  createdAt?: { seconds: number } | null;
};

function exportToExcel(rows: Row[]) {
  const headers = ["Date", "Name", "Phone", "Email", "Course", "Notes"];
  const data = rows.map((r) => [
    r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : "—",
    r.name || "", r.phone || "", r.email || "", r.course || "", r.message || "",
  ]);
  const csv = [headers, ...data].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kridha-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function AdminPage() {
  const { user, loading, signOut } = useAuth();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

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

  const courses = ["All", ...Array.from(new Set(rows?.map((r) => r.course || "").filter(Boolean)))];

  const filtered = (rows || []).filter((r) => {
    const matchSearch = !search || [r.name, r.phone, r.email, r.course, r.message]
      .some((v) => v?.toLowerCase().includes(search.toLowerCase()));
    const matchCourse = courseFilter === "All" || r.course === courseFilter;
    return matchSearch && matchCourse;
  });

  const totalBookings = rows?.length ?? 0;
  const uniqueCourses = new Set(rows?.map((r) => r.course)).size;
  const thisWeek = rows?.filter((r) => {
    if (!r.createdAt) return false;
    const d = new Date(r.createdAt.seconds * 1000);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-hero-gradient grid place-items-center text-white font-bold text-sm">K</div>
            <div>
              <h1 className="font-bold text-sm">Kridha Admin</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => rows && exportToExcel(filtered)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition"
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">← Home</Link>
            <button onClick={signOut} className="text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 lg:px-8 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Bookings", value: totalBookings, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "This Week", value: thisWeek, icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
            { label: "Courses", value: uniqueCourses, icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${s.bg} grid place-items-center shrink-0`}>
                <s.icon className={`h-6 w-6 ${s.color}`} />
              </div>
              <div>
                <div className="text-2xl font-extrabold">{s.value}</div>
                <div className="text-xs text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          >
            {courses.map((c) => <option key={c}>{c}</option>)}
          </select>
          <span className="text-xs text-muted-foreground">{filtered.length} results</span>
        </div>

        {/* Table */}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!rows ? (
          <p className="text-muted-foreground">Loading bookings…</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  {["#", "Date", "Name", "Phone", "Email", "Course", "Notes"].map((h) => (
                    <th key={h} className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((r, i) => (
                  <tr key={r.id} className="hover:bg-muted/40 transition">
                    <td className="px-4 py-3 text-muted-foreground text-xs">{i + 1}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                      {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : "—"}
                    </td>
                    <td className="px-4 py-3 font-semibold">{r.name || "—"}</td>
                    <td className="px-4 py-3">{r.phone || "—"}</td>
                    <td className="px-4 py-3 text-blue-600">{r.email || "—"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5">
                        {r.course || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-muted-foreground" title={r.message}>{r.message || "—"}</td>
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