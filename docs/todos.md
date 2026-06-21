# TalentaKu — Feature TODO List & Gap Analysis

Dokumen ini mencantumkan semua fitur yang belum dibuat, masih berupa tiruan (*mock*), atau belum terintegrasi sepenuhnya antara frontend dan backend.

---

## 1. Halaman Pengguna Publik (Public User Flow)

### ✅ Halaman Riwayat Asesmen (*My Assessments*)
*   **Status**: Selesai.
*   **Detail**: Halaman `/assessments` telah diimplementasikan dengan fitur daftar riwayat, filter pencarian, status badge, detail hasil dominan, dan fungsionalitas melanjutkan asesmen. Navigasi header dan mobile juga sudah terintegrasi ke rute baru ini.

### ✅ Halaman Hasil Asesmen (*Results Page*)
*   **Status**: Selesai.
*   **Detail**: Halaman [ResultsPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/ResultsPage.tsx) sudah terhubung ke backend untuk mengambil hasil evaluasi Forward Chaining secara real-time:
    *   **Fitur Cetak PDF**: Mengintegrasikan stylesheet khusus cetak `@media print` dalam `index.css` untuk menghasilkan tata letak PDF terstruktur, rapi, dan ekonomis.
    *   Secara otomatis menyembunyikan elemen web interaktif seperti header navbar, tombol pemicu cetak, pranala luar navigasi, dan log konsol inferensi teknis saat mencetak laporan.
    *   Memastikan elemen hasil bento grid dan panduan stimulasi tumbuh kembang terhindar dari pemotongan halaman tidak rapi (`break-inside: avoid`).

### ✅ Navigasi Mobile (*Mobile Navigation*)
*   **Status**: Selesai.
*   **Detail**: Menu pada komponen [MobileNav.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/components/layout/MobileNav.tsx) telah disesuaikan sepenuhnya agar selaras dengan rute dinamis aplikasi nyata (Beranda, Asesmen Saya, Sumber Daya, dan Panel Admin) serta menggunakan ikon representatif dari Google Material Symbols.

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

### ✅ Halaman Manajemen Variabel & Indikator
*   **Status**: Selesai.
*   **Detail**: Halaman [AdminVariablesPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/AdminVariablesPage.tsx) dan [AdminIndicatorsPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/AdminIndicatorsPage.tsx) telah diimplementasikan:
    *   Variabel masukan (C1-C83) dimuat secara dinamis, mendukung pencarian dan pengelompokan berdasarkan kriteria bakat (Intelektual Umum, Akademik Khusus, Berpikir Kreatif, Kepemimpinan, Seni Rupa, Psikomotorik).
    *   Indikator bakat (I1-I27) dimuat secara dinamis dari API aturan dengan pencarian.
    *   Halaman [AdminAssessmentsPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/AdminAssessmentsPage.tsx) ditambahkan untuk mendukung navigasi menu "Asesmen" di sidebar admin dengan layout admin terpadu.

### ✅ Halaman Pengaturan Sistem (*Admin Settings*)
*   **Status**: Selesai.
*   **Detail**: Halaman [AdminSettingsPage.tsx](file:///Users/wahyutricahya/Web%20Development/TalentaKu/frontend/src/pages/AdminSettingsPage.tsx) telah diimplementasikan dan terhubung ke `/api/admin/settings`:
    *   Mendukung pengubahan ambang batas skala Likert (Likert Threshold) antara 3, 4, dan 5 secara permanen di database.
    *   Mendukung pengubahan nama aplikasi sistem pakar.
    *   Menampilkan notifikasi/toast sukses saat penyimpanan data berhasil dilakukan ke backend.

---

## 3. Evaluasi Basis Pengetahuan (Knowledge Base)

### ⚠️ Validasi Variabel Psikomotorik (C70–C83)
*   **Status**: Data Sementara (*Temporary Placeholder*).
*   **Detail**: Karena tabel 8 pada dokumen jurnal asli terpotong sebagian di salinan PDF penelitian, teks label pertanyaan untuk C70–C83 masih memerlukan validasi lebih lanjut bersama pakar pendidikan anak usia dini atau verifikasi dari pustaka fisik asli guna memastikan keselarasan istilah observasi motorik kasar/halus.

---

## 4. Keamanan & Infrastruktur

*   **Penyimpanan Kredensial**: Password admin di database saat ini disimpan dalam bentuk teks biasa (*plain-text*) pada seeder database. Perlu dienkripsi menggunakan hashing seperti **bcrypt** sebelum sistem diluncurkan di server produksi.
*   **Penyimpanan State & Token**: Belum ada sistem penyimpanan token JWT admin di local/session storage dengan manajemen refresh token yang aman.
