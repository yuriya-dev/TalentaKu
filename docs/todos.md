# TalentaKu — Feature TODO List & Gap Analysis

Dokumen ini mencantumkan semua fitur yang belum dibuat, masih berupa tiruan (*mock*), atau belum terintegrasi sepenuhnya antara frontend dan backend.

---

## 1. Halaman Pengguna Publik (Public User Flow)

### ✅ Halaman Riwayat Asesmen (*My Assessments*)
*   **Status**: Selesai.
*   **Detail**: Halaman `/assessments` telah diimplementasikan dengan fitur daftar riwayat, filter pencarian, status badge, detail hasil dominan, dan fungsionalitas melanjutkan asesmen. Navigasi header dan mobile juga sudah terintegrasi ke rute baru ini.

### ⚠️ Halaman Hasil Asesmen (*Results Page*)
*   **Status**: Terintegrasi Sebagian.
*   **Detail**: Halaman [ResultsPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/ResultsPage.tsx) sudah terhubung ke backend untuk mengambil hasil evaluasi Forward Chaining secara real-time. Namun beberapa hal berikut belum selesai:
    *   **Fitur Cetak PDF**: Tombol "Cetak Laporan Penilaian (PDF)" saat ini hanya memicu fungsi cetak bawaan browser `window.print()`. Belum ada layout khusus cetak (@media print CSS) atau ekspor dokumen PDF terstruktur yang rapi.

### ⚠️ Navigasi Mobile (*Mobile Navigation*)
*   **Status**: Terintegrasi Sebagian.
*   **Detail**: Menu "Statistik" di [MobileNav.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/components/layout/MobileNav.tsx) secara statis mengarah ke `/results/1` (menggunakan ID keras). Menu "Profil" masih berupa tautan kosong (`#`).

---

## 2. Panel Admin (Admin Dashboard & Management)

### ✅ Autentikasi Admin & Manajemen Sesi (*Admin Login*)
*   **Status**: Selesai.
*   **Detail**: Layar login admin (`/admin/login`) telah diimplementasikan dengan validasi JWT. Rute admin (`/admin/*`) dilindungi oleh wrapper guard component `AdminRoute` yang memvalidasi masa berlaku token. Tombol "Keluar" (Logout) di sidebar admin sekarang menghapus sesi token JWT dan mengalihkan pengguna ke layar masuk. Endpoint backend `/api/admin/*` telah diamankan dengan middleware `AuthRequired`.

### ✅ Dasbor Utama Admin (*Admin Dashboard*)
*   **Status**: Selesai.
*   **Detail**: Komponen [AdminDashboard.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/AdminDashboard.tsx) telah sepenuhnya terintegrasi dengan backend API:
    *   Statistik jumlah asesmen, siswa aktif, dan bakat teridentifikasi diambil secara langsung dari `/api/admin/stats`.
    *   Grafik distribusi bakat memetakan data riil dari backend.
    *   Tabel "Recent Consultations" menampilkan 5 data riwayat asesmen terbaru dengan tautan navigasi dinamis ke detail atau proses asesmen.
    *   Menampilkan data email dan peranan pengguna admin yang sedang aktif dari session JWT token.

### ✅ Pembuat Aturan Aturan Admin (*Admin Rules Page*)
*   **Status**: Selesai.
*   **Detail**: Komponen [AdminRulesPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/AdminRulesPage.tsx) telah dihubungkan dengan backend API:
    *   Tabel aturan memuat data relasi `IndicatorVariable` (Level 1) dan `CriterionIndicator` (Level 2) secara dinamis dari `/api/admin/rules` menghasilkan total 33 aturan aktif.
    *   Mendukung pencarian aturan berbasis filter teks dan pemisahan level aturan (Semua, L1, L2) dengan paginasi halaman (10 data per halaman).
    *   Panel edit aturan mendukung modifikasi kondisi premis secara interaktif di frontend (disimpan secara lokal untuk simulasi).
    *   Modul simulasi Forward Chaining terintegrasi dengan `/api/admin/rules/simulate` di mana pengguna dapat menyesuaikan nilai dari seluruh variabel masukan dan menguji hasil inferensi bakat secara real-time.

### ❌ Halaman Manajemen Variabel & Indikator
*   **Status**: Belum Dibuat di Frontend.
*   **Detail**: Menu "Variabel" (`/admin/variables`) dan "Indikator" (`/admin/indicators`) pada sidebar belum memiliki rute halaman di router React (`App.tsx`). Saat diklik, halaman akan kosong atau tetap di halaman dasbor.

### ❌ Halaman Pengaturan Sistem (*Admin Settings*)
*   **Status**: Belum Dibuat di Frontend.
*   **Detail**: Menu "Pengaturan" (`/admin/settings`) di sidebar belum diimplementasikan. Halaman untuk mengubah parameter sistem seperti ambang batas skala Likert (*Likert threshold*)—yang didukung backend lewat `/api/admin/settings`—belum tersedia.

---

## 3. Evaluasi Basis Pengetahuan (Knowledge Base)

### ⚠️ Validasi Variabel Psikomotorik (C70–C83)
*   **Status**: Data Sementara (*Temporary Placeholder*).
*   **Detail**: Karena tabel 8 pada dokumen jurnal asli terpotong sebagian di salinan PDF penelitian, teks label pertanyaan untuk C70–C83 masih memerlukan validasi lebih lanjut bersama pakar pendidikan anak usia dini atau verifikasi dari pustaka fisik asli guna memastikan keselarasan istilah observasi motorik kasar/halus.

---

## 4. Keamanan & Infrastruktur

*   **Penyimpanan Kredensial**: Password admin di database saat ini disimpan dalam bentuk teks biasa (*plain-text*) pada seeder database. Perlu dienkripsi menggunakan hashing seperti **bcrypt** sebelum sistem diluncurkan di server produksi.
*   **Penyimpanan State & Token**: Belum ada sistem penyimpanan token JWT admin di local/session storage dengan manajemen refresh token yang aman.
