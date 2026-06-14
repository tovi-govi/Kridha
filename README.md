# Kridha Security Audit Report

Date: 2026-06-14

Scope reviewed: React/TanStack frontend, Firebase Auth/Firestore usage, public booking form, admin dashboard, import/export flows, environment examples, Firestore rules, and Vercel deployment config. This was a defensive source-code review only; no harmful testing, live probing, credential use, or exploit execution was performed.

## Fixes Applied

### 1. Public booking writes had weak validation

- Risk level: High
- Location: `src/components/BookingSection.tsx`, `firestore.rules`
- What was wrong: The public form accepted mostly unbounded strings and Firestore allowed unauthenticated booking creation as long as fields existed.
- Safe abuse summary: Automated submissions could fill Firestore with malformed or oversized lead data and make admin workflows unreliable.
- Fix applied:
  1. Added client-side trimming, length limits, course allow-list checks, phone validation, and email validation.
  2. Added matching Firestore validation for public creates.
  3. Replaced detailed public error output with a generic submission failure message.
- Safer config/code now in place: `validPublicBookingCreate()` in `firestore.rules` and `validateBookingForm()` in `BookingSection.tsx`.
- Remaining action: Enable Firebase App Check and add rate limiting through a backend function, WAF, or protected API endpoint for stronger abuse protection.

### 2. Admin authorization depended partly on browser-visible email lists

- Risk level: High
- Location: `src/lib/firebase.ts`, `src/routes/admin.tsx`, `.env.example`
- What was wrong: The admin route imported a `VITE_ADMIN_EMAILS` list for client-side gating. Anything prefixed with `VITE_` is public in the browser bundle.
- Safe abuse summary: An attacker could learn admin email addresses and target those accounts with phishing or credential attacks. Client-side checks also should never be the source of truth.
- Fix applied:
  1. Removed `ADMIN_EMAILS` and `VITE_ADMIN_EMAILS` usage from client code.
  2. Admin access now relies on Firestore permission results.
  3. Removed real-looking admin email examples from `.env.example`.
- Safer config/code now in place: `src/routes/admin.tsx` loads bookings only after sign-in and handles Firestore `permission-denied`.
- Remaining action: Prefer Firebase custom claims such as `request.auth.token.admin == true` instead of email allow-lists in `firestore.rules`.

### 3. Admin updates were too broad

- Risk level: Medium
- Location: `firestore.rules`
- What was wrong: Authenticated admins could update any booking field from the client.
- Safe abuse summary: If an admin account or session were compromised, lead records could be altered more broadly than the UI requires.
- Fix applied:
  1. Split create/read/update/delete permissions.
  2. Restricted admin updates to the `checkedOut` field only.
  3. Kept reads and deletes admin-only.
- Safer config/code now in place: `validAdminBookingUpdate()` in `firestore.rules`.

### 4. Self-service account creation was exposed in the admin login UI

- Risk level: Medium
- Location: `src/routes/login.tsx`
- What was wrong: The login page allowed visitors to create Firebase Auth accounts.
- Safe abuse summary: Attackers could create accounts and repeatedly test the admin boundary, increasing noise and abuse risk.
- Fix applied:
  1. Removed the sign-up mode from the UI.
  2. Changed successful login navigation to `/admin`.
  3. Replaced Firebase error details with generic auth failure messages.
- Remaining action: Disable public email/password sign-up in the Firebase Console if only admins should have accounts.

### 5. CSV export was vulnerable to spreadsheet formula injection

- Risk level: Medium
- Location: `src/routes/admin.tsx`
- What was wrong: User-provided booking fields were exported directly to CSV.
- Safe abuse summary: A malicious lead value could be interpreted as a formula when an admin opens the CSV in spreadsheet software.
- Fix applied:
  1. Added CSV cell sanitization for formula-leading characters.
  2. Kept standard CSV quote escaping.
- Safer code now in place: `sanitizeCsvCell()` in `exportToCSV()`.

### 6. Spreadsheet import lacked size/type guardrails

- Risk level: Medium
- Location: `src/routes/admin.tsx`
- What was wrong: Admin import relied mainly on the browser `accept` attribute and did not bound file size, file count, or row count.
- Safe abuse summary: Large files could cause browser memory pressure or accidental large writes.
- Fix applied:
  1. Limited imports to 5 files at a time.
  2. Limited each file to 2 MB.
  3. Limited each sheet to 1,000 rows.
  4. Added extension checks and imported contact cleanup.
- Safer code now in place: `validateImportFile()` and `readContactsFromSpreadsheet()`.

### 7. Security headers were missing from deployment config

- Risk level: Medium
- Location: `vercel.json`
- What was wrong: No explicit browser security headers were configured.
- Safe abuse summary: Missing headers can increase risk from clickjacking, MIME sniffing, excess referrer leakage, and overbroad browser permissions.
- Fix applied:
  1. Added HSTS.
  2. Added `X-Content-Type-Options: nosniff`.
  3. Added `X-Frame-Options: DENY`.
  4. Added `Referrer-Policy`.
  5. Added `Permissions-Policy`.
  6. Added `Cross-Origin-Opener-Policy`.
- Remaining action: Add and test a Content Security Policy after confirming all scripts, styles, Firebase, EmailJS, and font domains required in production.

### 8. Public service identifiers appeared in example environment files

- Risk level: Low
- Location: `.env.example`, `.env.local`
- What was wrong: `.env.example` contained real-looking EmailJS public/service/template IDs. `.env.local` also contains current local public IDs.
- Safe abuse summary: EmailJS public identifiers are not equivalent to server secrets, but publishing real IDs makes abuse easier if provider-side origin restrictions are weak.
- Fix applied:
  1. Replaced `.env.example` values with placeholders.
  2. Removed client-side admin email example from `.env.example`.
- Remaining action:
  1. Confirm `.env.local` is not committed.
  2. Restrict EmailJS allowed origins/templates in EmailJS settings.
  3. Restrict Firebase API key usage in Google Cloud by HTTP referrer and enabled APIs.

## Console / Provider Actions Still Required

1. Firebase Auth: disable self-service sign-up if the app should only have admins.
2. Firebase Auth: enable MFA for admin accounts.
3. Firebase Auth/Firestore: migrate admin authorization from email allow-lists to custom claims.
4. Firebase App Check: enforce App Check for Firestore to reduce automated public writes.
5. Google Cloud: restrict the Firebase browser API key by HTTP referrer and Firebase-related APIs only.
6. EmailJS: restrict allowed origins and rotate public identifiers if they were exposed publicly.
7. Production monitoring: add alerts for booking write spikes and repeated permission-denied activity.

## Areas Reviewed With No Material Finding In This Codebase

- Payment flow: no payment code found.
- SQL injection: no SQL database or raw query construction found.
- NoSQL injection: Firestore queries use SDK calls with fixed collection names; the main issue was write validation, now tightened.
- CSRF: Firebase SDK calls use Auth state/token-based authorization, not ambient cookie-only auth.
- File upload to storage: no user file storage upload flow found; spreadsheet parsing is local admin-only and now bounded.
- XSS: React escapes rendered booking values by default. No user-controlled `dangerouslySetInnerHTML` usage was found in active app flows.

