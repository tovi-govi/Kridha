import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { ThemeProvider, useTheme } from "@/lib/theme-provider";
import {
  Download,
  Users,
  BookOpen,
  TrendingUp,
  Upload,
  Loader2,
  Trash2,
  Phone,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

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

type ImportedContact = Pick<Row, "name" | "email" | "phone">;

const IMPORT_BATCH_SIZE = 100;
const MAX_IMPORT_FILES = 5;
const MAX_IMPORT_FILE_BYTES = 2 * 1024 * 1024;
const MAX_IMPORT_ROWS = 1000;
const CLEAR_BATCH_SIZE = 500;
const PAGE_SIZE = 100;
const PERMISSION_DENIED_MESSAGE =
  "You are not authorised to manage bookings. Ask the site owner to grant admin access in Firebase.";
const MAX_NAME_LENGTH = 80;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 20;
const PHONE_PATTERN = /^[+()0-9 .-]{7,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const IMPORT_EXTENSIONS = new Set(["csv", "xls", "xlsx"]);

const IMPORT_ALIASES = {
  name: ["name", "fullname", "studentname", "customername"],
  email: ["email", "emailaddress", "mail"],
  phone: [
    "phone",
    "phonenumber",
    "mobile",
    "mobilenumber",
    "contact",
    "contactnumber",
    "whatsapp",
    "whatsappnumber",
  ],
} satisfies Record<keyof ImportedContact, string[]>;

function getDateMs(row: Row) {
  return row.createdAt ? row.createdAt.seconds * 1000 : 0;
}

function getPaginationItems(currentPage: number, pageCount: number) {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  const pages: Array<number | "start-ellipsis" | "end-ellipsis"> = [1];
  let middleStart = Math.max(2, currentPage - 1);
  let middleEnd = Math.min(pageCount - 1, currentPage + 1);

  if (currentPage <= 3) {
    middleStart = 2;
    middleEnd = 4;
  }

  if (currentPage >= pageCount - 2) {
    middleStart = pageCount - 3;
    middleEnd = pageCount - 1;
  }

  if (middleStart > 2) {
    pages.push("start-ellipsis");
  }

  for (let page = middleStart; page <= middleEnd; page += 1) {
    pages.push(page);
  }

  if (middleEnd < pageCount - 1) {
    pages.push("end-ellipsis");
  }

  pages.push(pageCount);

  return pages;
}

function normalizeColumnName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function normalizePhoneNumber(value: string) {
  return value.replace(/\D/g, "");
}

function getPhoneDedupeKey(value?: string) {
  const digits = normalizePhoneNumber(value || "");

  if (!digits) return "";

  return digits.length > 10 ? digits.slice(-10) : digits.replace(/^0+/, "");
}

function formatCellValue(value: unknown) {
  if (value === null || value === undefined) return "";
  if (value instanceof Date) return value.toISOString();

  return String(value).trim();
}

function cleanText(value: string, maxLength: number) {
  return value.trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function cleanImportedContact(contact: ImportedContact): ImportedContact {
  return {
    name: cleanText(contact.name || "", MAX_NAME_LENGTH),
    email: cleanText(contact.email || "", MAX_EMAIL_LENGTH).toLowerCase(),
    phone: cleanText(contact.phone || "", MAX_PHONE_LENGTH),
  };
}

function hasValidOptionalEmail(value?: string) {
  return !value || EMAIL_PATTERN.test(value);
}

function hasValidOptionalPhone(value?: string) {
  return !value || PHONE_PATTERN.test(value);
}

function validateImportFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "";

  if (!IMPORT_EXTENSIONS.has(extension)) {
    throw new Error(`${file.name} is not a supported spreadsheet type.`);
  }

  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new Error(`${file.name} is larger than the 2 MB import limit.`);
  }
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });
}

function isPermissionDeniedError(err: unknown) {
  if (typeof err === "object" && err && "code" in err && err.code === "permission-denied") {
    return true;
  }

  return err instanceof Error && err.message.toLowerCase().includes("permission");
}

function getImportedCell(row: Record<string, unknown>, field: keyof ImportedContact) {
  for (const [key, value] of Object.entries(row)) {
    const normalizedKey = normalizeColumnName(key);

    if (IMPORT_ALIASES[field].includes(normalizedKey)) {
      return formatCellValue(value);
    }
  }

  return "";
}

async function readContactsFromSpreadsheet(file: File) {
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("No sheets found in the selected file.");
  }

  const sheet = workbook.Sheets[sheetName];
  const sheetRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: "",
    raw: false,
  });

  if (sheetRows.length > MAX_IMPORT_ROWS) {
    throw new Error(`Import files can contain at most ${MAX_IMPORT_ROWS} rows.`);
  }

  const contacts = sheetRows
    .map((row) => ({
      name: getImportedCell(row, "name"),
      email: getImportedCell(row, "email"),
      phone: getImportedCell(row, "phone"),
    }))
    .map(cleanImportedContact)
    .filter(
      (row) =>
        (row.name || row.email || row.phone) &&
        hasValidOptionalEmail(row.email) &&
        hasValidOptionalPhone(row.phone),
    );

  if (!contacts.length) {
    throw new Error("No rows found with Name, Email, or Phone columns in the selected file.");
  }

  return contacts;
}

function exportToCSV(rows: Row[]) {
  const headers = ["Date", "Name", "Phone", "Email", "Course", "Notes", "Checked Out"];

  const sanitizeCsvCell = (cell: unknown) => {
    const value = String(cell ?? "");
    return /^[=+\-@]/.test(value.trimStart()) ? `'${value}` : value;
  };

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
    .map((row) => row.map((cell) => `"${sanitizeCsvCell(cell).replace(/"/g, '""')}"`).join(","))
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
  return (
    <ThemeProvider>
      <AdminDashboard />
    </ThemeProvider>
  );
}

function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importProgress, setImportProgress] = useState<{
    imported: number;
    total: number;
    batch: number;
    totalBatches: number;
    status: string;
  } | null>(null);
  const [clearProgress, setClearProgress] = useState<{
    deleted: number;
    total: number;
    batch: number;
    totalBatches: number;
    status: string;
  } | null>(null);
  const [clearing, setClearing] = useState(false);

  const [phoneSearch, setPhoneSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const loadBookings = useCallback(async () => {
    if (!user) return;

    setError(null);
    setPermissionDenied(false);

    try {
      const snap = await getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc")));

      const bookings = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Row, "id">),
      }));

      setRows(bookings);
    } catch (err: unknown) {
      if (isPermissionDeniedError(err)) {
        setPermissionDenied(true);
        setError(PERMISSION_DENIED_MESSAGE);
        setRows([]);
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load bookings");
      setRows([]);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;
    if (files.length > MAX_IMPORT_FILES) {
      setError(`Select at most ${MAX_IMPORT_FILES} files at a time.`);
      return;
    }

    setImporting(true);
    setImportMessage(null);
    setImportProgress(null);
    setClearProgress(null);
    setError(null);

    try {
      files.forEach(validateImportFile);

      const contacts: ImportedContact[] = [];
      let skippedDuplicates = 0;
      const seenPhones = new Set(
        (rows || []).map((row) => getPhoneDedupeKey(row.phone)).filter(Boolean),
      );

      for (const [fileIndex, file] of files.entries()) {
        setImportProgress({
          imported: 0,
          total: 0,
          batch: 0,
          totalBatches: 0,
          status: `Reading file ${fileIndex + 1} of ${files.length}`,
        });

        const fileContacts = await readContactsFromSpreadsheet(file);

        for (const contact of fileContacts) {
          const phoneKey = getPhoneDedupeKey(contact.phone);

          if (phoneKey && seenPhones.has(phoneKey)) {
            skippedDuplicates += 1;
            continue;
          }

          if (phoneKey) {
            seenPhones.add(phoneKey);
          }

          contacts.push(contact);
        }
      }

      if (!contacts.length) {
        setImportMessage(
          `No new contacts imported. Skipped ${skippedDuplicates} duplicate phone number(s).`,
        );
        return;
      }

      const totalBatches = Math.ceil(contacts.length / IMPORT_BATCH_SIZE);

      for (let index = 0; index < contacts.length; index += IMPORT_BATCH_SIZE) {
        const batchNumber = Math.floor(index / IMPORT_BATCH_SIZE) + 1;
        const batch = writeBatch(db);
        const chunk = contacts.slice(index, index + IMPORT_BATCH_SIZE);

        setImportProgress({
          imported: index,
          total: contacts.length,
          batch: batchNumber,
          totalBatches,
          status: `Uploading batch ${batchNumber} of ${totalBatches}`,
        });
        await waitForNextPaint();

        chunk.forEach((contact) => {
          const bookingRef = doc(collection(db, "bookings"));

          batch.set(bookingRef, {
            name: contact.name || "",
            email: contact.email || "",
            phone: contact.phone || "",
            course: "",
            message: "",
            checkedOut: false,
            uid: user?.uid || null,
            createdAt: serverTimestamp(),
          });
        });

        await batch.commit();
        setImportProgress({
          imported: Math.min(index + chunk.length, contacts.length),
          total: contacts.length,
          batch: batchNumber,
          totalBatches,
          status: `Finished batch ${batchNumber} of ${totalBatches}`,
        });
      }

      await loadBookings();
      setImportMessage(
        `Imported ${contacts.length} contact(s) from ${files.length} file(s). Skipped ${skippedDuplicates} duplicate phone number(s).`,
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to import files");
    } finally {
      setImporting(false);
      setImportProgress(null);
    }
  }

  async function handleClearEverything() {
    if (clearing) return;

    const confirmed = window.confirm(
      "Clear all booking records from the database? This cannot be undone.",
    );

    if (!confirmed) return;

    setClearing(true);
    setImportMessage(null);
    setImportProgress(null);
    setClearProgress({
      deleted: 0,
      total: 0,
      batch: 0,
      totalBatches: 0,
      status: "Finding booking records",
    });
    setError(null);

    try {
      const snap = await getDocs(collection(db, "bookings"));
      const docs = snap.docs;
      const totalBatches = Math.ceil(docs.length / CLEAR_BATCH_SIZE);

      if (!docs.length) {
        setRows([]);
        setImportMessage("No booking records to clear.");
        return;
      }

      for (let index = 0; index < docs.length; index += CLEAR_BATCH_SIZE) {
        const batchNumber = Math.floor(index / CLEAR_BATCH_SIZE) + 1;
        const batch = writeBatch(db);
        const chunk = docs.slice(index, index + CLEAR_BATCH_SIZE);

        setClearProgress({
          deleted: index,
          total: docs.length,
          batch: batchNumber,
          totalBatches,
          status: `Deleting batch ${batchNumber} of ${totalBatches}`,
        });
        await waitForNextPaint();

        chunk.forEach((bookingDoc) => {
          batch.delete(bookingDoc.ref);
        });

        await batch.commit();
        setClearProgress({
          deleted: Math.min(index + chunk.length, docs.length),
          total: docs.length,
          batch: batchNumber,
          totalBatches,
          status: `Deleted batch ${batchNumber} of ${totalBatches}`,
        });
      }

      setRows([]);
      setImportMessage(`Cleared ${docs.length} booking record(s).`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to clear bookings");
      await loadBookings();
    } finally {
      setClearing(false);
      setClearProgress(null);
    }
  }

  async function toggleCheckedOut(id: string, checkedOut: boolean) {
    if (!rows) return;

    const oldRows = rows;

    setRows(rows.map((row) => (row.id === id ? { ...row, checkedOut } : row)));

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
        const phoneSearchText = getPhoneDedupeKey(phoneSearch);

        const matchesPhone =
          !phoneSearchText || getPhoneDedupeKey(r.phone).includes(phoneSearchText);

        const matchesCourse = courseFilter === "All" || r.course === courseFilter;

        return matchesPhone && matchesCourse;
      })
      .sort((a, b) => {
        const dateA = getDateMs(a);
        const dateB = getDateMs(b);

        return sortDir === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [rows, phoneSearch, courseFilter, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, pageCount);
  const pageStart = (safeCurrentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);
  const paginationItems = getPaginationItems(safeCurrentPage, pageCount);

  useEffect(() => {
    setCurrentPage(1);
  }, [phoneSearch, courseFilter, sortDir]);

  useEffect(() => {
    if (currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  const courses = [
    "All",
    ...Array.from(new Set((rows || []).map((r) => r.course).filter(Boolean))),
  ];

  const totalBookings = rows?.length ?? 0;

  const uniqueCourses = new Set((rows || []).map((r) => r.course).filter(Boolean)).size;

  const checkedCount = (rows || []).filter((r) => r.checkedOut).length;

  const thisWeek = (rows || []).filter((r) => {
    if (!r.createdAt) return false;

    const bookingDate = new Date(r.createdAt.seconds * 1000);
    const now = new Date();

    const diffDays = (now.getTime() - bookingDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays <= 7;
  }).length;

  if (loading) {
    return (
      <div
        className={`${theme} min-h-screen grid place-items-center bg-background text-muted-foreground`}
      >
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div
        className={`${theme} min-h-screen grid place-items-center bg-background px-4 text-foreground`}
      >
        <div className="max-w-sm w-full text-center bg-card border border-border rounded-2xl p-8 shadow-soft">
          <h1 className="text-xl font-bold">Admin access</h1>

          <p className="mt-2 text-sm text-muted-foreground">Please sign in to continue.</p>

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

  if (permissionDenied) {
    return (
      <div
        className={`${theme} min-h-screen grid place-items-center bg-background px-4 text-foreground`}
      >
        <div className="max-w-sm w-full text-center bg-card border border-border rounded-2xl p-8 shadow-soft">
          <h1 className="text-xl font-bold">Not authorised</h1>

          <p className="mt-2 text-sm text-muted-foreground">{PERMISSION_DENIED_MESSAGE}</p>

          <p className="mt-2 text-xs text-muted-foreground">{user.email}</p>

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
    <div className={`${theme} min-h-screen bg-background text-foreground`}>
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
        <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-5 py-3 lg:h-16 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-0">
          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
            <div className="h-8 w-8 rounded-lg bg-hero-gradient grid place-items-center text-white font-bold text-sm">
              K
            </div>

            <div>
              <h1 className="font-bold text-sm">Kridha Admin</h1>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              multiple
              onChange={handleImport}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/10 transition hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {importing ? "Importing..." : "Import Excel Files"}
            </button>

            <button
              onClick={() => exportToCSV(filtered)}
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-900/10 transition hover:bg-emerald-700 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            <button
              onClick={handleClearEverything}
              disabled={clearing || importing || !rows?.length}
              className="inline-flex items-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-red-900/10 transition hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {clearing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {clearing ? "Clearing..." : "Clear Everything"}
            </button>

            <button
              onClick={toggle}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-grid h-10 w-10 place-items-center rounded-full border border-border bg-background text-foreground transition hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
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
          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-soft">
            <div className="h-12 w-12 rounded-xl bg-blue-50 grid place-items-center shrink-0 dark:bg-blue-500/15">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{totalBookings}</div>
              <div className="text-xs text-muted-foreground">Total Bookings</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-soft">
            <div className="h-12 w-12 rounded-xl bg-emerald-50 grid place-items-center shrink-0 dark:bg-emerald-500/15">
              <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-300" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{thisWeek}</div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-soft">
            <div className="h-12 w-12 rounded-xl bg-violet-50 grid place-items-center shrink-0 dark:bg-violet-500/15">
              <BookOpen className="h-6 w-6 text-violet-600 dark:text-violet-300" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{uniqueCourses}</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-soft">
            <div className="h-12 w-12 rounded-xl bg-orange-50 grid place-items-center shrink-0 dark:bg-orange-500/15">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-300" />
            </div>

            <div>
              <div className="text-2xl font-extrabold">{checkedCount}</div>
              <div className="text-xs text-muted-foreground">Checked Out</div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <input
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              inputMode="numeric"
              placeholder="Search by number"
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm outline-none transition placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-ring"
          >
            {courses.map((course) => (
              <option key={course} value={course}>
                {course}
              </option>
            ))}
          </select>

          <button
            onClick={() => setSortDir((prev) => (prev === "desc" ? "asc" : "desc"))}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-semibold transition hover:bg-muted"
          >
            Date: {sortDir === "desc" ? "Newest First" : "Oldest First"}
          </button>

          <span className="text-xs text-muted-foreground">
            Showing {pageRows.length ? pageStart + 1 : 0}-{pageStart + pageRows.length} of{" "}
            {filtered.length} results
          </span>
        </div>

        {importProgress && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 dark:border-blue-400/20 dark:bg-blue-500/10">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-blue-700 dark:text-blue-200">
              <span>{importProgress.status}</span>
              <span>
                Imported {importProgress.imported} / {importProgress.total || "..."}
              </span>
            </div>

            {!!importProgress.total && (
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-blue-100 dark:bg-blue-950">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((importProgress.imported / importProgress.total) * 100),
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>
        )}

        {importMessage && (
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
            {importMessage}
          </p>
        )}

        {error && <p className="text-sm text-red-500 dark:text-red-300">{error}</p>}

        {!rows ? (
          <p className="text-muted-foreground">Loading bookings...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
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
                  {pageRows.map((r, index) => (
                    <tr
                      key={r.id}
                      className={
                        r.checkedOut
                          ? "bg-emerald-50/60 transition hover:bg-emerald-50 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/15"
                          : "transition hover:bg-muted/40"
                      }
                    >
                      <td className="px-4 py-3 text-muted-foreground text-xs">
                        {pageStart + index + 1}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                        {r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleString() : "—"}
                      </td>

                      <td className="px-4 py-3 font-semibold">{r.name || "—"}</td>

                      <td className="px-4 py-3">{r.phone || "—"}</td>

                      <td className="px-4 py-3 text-blue-600 dark:text-blue-300">
                        {r.email || "—"}
                      </td>

                      <td className="px-4 py-3">
                        <span className="rounded-full bg-violet-100 text-violet-700 text-xs font-semibold px-2 py-0.5 dark:bg-violet-500/15 dark:text-violet-200">
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
                            onChange={(e) => toggleCheckedOut(r.id, e.target.checked)}
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

            {pageCount > 1 && (
              <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold text-muted-foreground">
                  Page {safeCurrentPage} of {pageCount}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safeCurrentPage === 1}
                    className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <div className="flex items-center gap-1 rounded-xl bg-muted/60 p-1">
                    {paginationItems.map((page) =>
                      typeof page === "number" ? (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={
                            page === safeCurrentPage
                              ? "h-9 min-w-9 rounded-lg bg-primary px-3 text-sm font-bold text-primary-foreground shadow-sm"
                              : "h-9 min-w-9 rounded-lg px-3 text-sm font-semibold text-muted-foreground transition hover:bg-background hover:text-foreground"
                          }
                        >
                          {page}
                        </button>
                      ) : (
                        <span
                          key={page}
                          className="grid h-9 min-w-9 place-items-center px-1 text-sm font-bold text-muted-foreground"
                        >
                          ...
                        </span>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() => setCurrentPage((page) => Math.min(pageCount, page + 1))}
                    disabled={safeCurrentPage === pageCount}
                    className="inline-flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-2 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
