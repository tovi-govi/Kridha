import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db, ADMIN_EMAILS } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { Download, Users, BookOpen, TrendingUp, Search } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Kridha" }] }),
});

type Row = {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  course?: string;
  message?: string;
  uid?: string | null;
  checkedOut?: boolean;
  createdAt?: { seconds: number } | null;
};

function getDateMs(row: Row) {
  return row.createdAt ? row.createdAt.seconds * 1000 : 0;
}

function exportToCSV(rows: Row[]) {
  const headers = [
    "Date",
    "Name",
    "Phone",
    "Email",
    "Course",
    "Notes",
    "Checked Out",
  ];

  const data = rows.map((r) => [
    r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : "—",
    r.name || "",
    r.phone || "",
    r.email || "",
    r.course || "",
    r.message || "",
    r.checkedOut ? "Yes" : "No",
  ]);

  const csv = [headers, ...data]
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");

  const isAdmin = !!user?.email && ADMIN_EMAILS.includes(user.email);

  useEffect(() => {
    if (!isAdmin) return;

    async function loadBookings() {
      setError(null);

      try {
        const snap = await getDocs(
          query(collection(db, "bookings"), orderBy("createdAt", "desc"))
        );

        const bookings = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Row, "id">),
        }));

        setRows(bookings);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
        setRows([]);
      }
    }

    loadBookings();
  }, [isAdmin]);

  async function toggleCheckedOut(id: string, checkedOut: boolean) {
    if (!rows) return;

    const oldRows = rows;

    setRows(
      rows.map((row) => (row.id === id ? { ...row, checkedOut } : row))
    );

    setError(null);

    try {
      await updateDoc(doc(db, "bookings", id), {
        checkedOut,
      });
    } catch (err: unknown) {
      setRows(oldRows);
      setError(err instanceof Error ? err.message : "Failed to update status");
    }
  }

  const filtered = useMemo(() => {
    return (rows || [])
      .filter((r) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
          !searchText ||
          [r.name, r.phone, r.email, r.course, r.message].some((value) =>
            value?.toLowerCase().includes(searchText)
          );

        const matchesCourse =
          courseFilter === "All" || r.course === courseFilter;

        return matchesSearch && matchesCourse;
      })
      .sort((a, b) => {
        const dateA = getDateMs(a);
        const dateB = getDateMs(b);

        return sortDir === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [rows, search, courseFilter, sortDir]);

  const courses = [
    "All",
    ...Array.from(new Set((rows || []).map((r) => r.course).filter(Boolean))),
  ];

  const totalBookings = rows?.length ?? 0;

  const uniqueCourses = new Set(
    (rows || []).map((r) => r.course).filter(Boolean)
  ).size;

  const checkedCount = (rows || []).filter((r) => r.checkedOut).length;

  const thisWeek = (rows || []).filter((r) => {
    if (!r.createdAt) return false;

    const bookingDate = new Date(r.createdAt.seconds * 1000);
    const now = new Date();

    const diffDays =
      (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-sm w-full text-center bg-card border border-border rounded-2xl p-8">
          <h1 className="text-xl font-bold">Admin access</h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Please sign in to continue.
          </p>

          <Link
            to="/login"
            className="mt-5 inline-block rounded-full bg-primary text-primary-foreground px-5 py-2 font-semibold"
          >
            Sign in
          </Link>
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
            Signed in as {user.email}. Add this email to{" "}
            <code>ADMIN_EMAILS</code> in <code>src/lib/firebase.ts</code>.
          </p>

          <button
            onClick={signOut}
            className="mt-5 rounded-full border border-border px-5 py-2 font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-hero-gradient grid place-items-center text-white font-bold text-sm">
              K
            </div>

            <div>
              <h1 className="font-bold text-sm">Kridha Admin</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => exportToCSV(filtered)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Home
            </Link>

            <button
              onClick={signOut}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 lg:px-8 py-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{totalBookings}</div>
              <div className="text-xs text-muted-foreground">
                Total Bookings
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 grid place-items-center shrink-0">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{thisWeek}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-violet-50 grid place-items-center shrink-0">
              <BookOpen className="h-6 w-6 text-violet-600" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{uniqueCourses}</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 grid place-items-center shrink-0">
              <Users className="h-6 w-6 text-orange-600" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{checkedCount}</div>
              <div className="text-xs text-muted-foreground">Checked Out</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
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
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              setSortDir((prev) => (prev === "desc" ? "asc" : "desc"))
            }
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold hover:bg-muted transition"
          >
            Date: {sortDir === "desc" ? "Newest First" : "Oldest First"}
          </button>

          <span className="text-xs text-muted-foreground">
            {filtered.length} results
          </span>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!rows ? (
          <p className="text-muted-foreground">Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-4 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                    Checked
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {filtered.map((r, index) => (
                  <tr
                    key={r.id}
                    className={
                      r.checkedOut
                        ? "bg-emerald-50/60 hover:bg-emerald-50 transition"
                        : "hover:bg-muted/40 transition"
                    }
                  >
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                      {r.createdAt
                        ? new Date(r.createdAt.seconds * 1000).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-4 py-3 font-semibold">
                      {r.name || "—"}
                    </td>

                    <td className="px-4 py-3">{r.phone || "—"}</td>

                    <td className="px-4 py-3 text-blue-600">
                      {r.email || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5">
                        {r.course || "—"}
                      </span>
                    </td>

                    <td
                      className="px-4 py-3 max-w-xs truncate text-muted-foreground"
                      title={r.message || ""}
                    >
                      {r.message || "—"}
                    </td>

                    <td className="px-4 py-3">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!r.checkedOut}
                          onChange={(e) =>
                            toggleCheckedOut(r.id, e.target.checked)
                          }
                          className="h-4 w-4 rounded border-border accent-emerald-600"
                        />

                        <span className="text-xs font-semibold text-muted-foreground">
                          {r.checkedOut ? "Done" : "Pending"}
                        </span>
                      </label>
                    </td>
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