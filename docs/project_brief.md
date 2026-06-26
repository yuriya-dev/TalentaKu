# Project Brief: Sistem Pakar Penentuan Bakat Anak (Forward Chaining) - TalentaKu

## 1. Latar Belakang & Referensi

Sistem ini dikembangkan dari landasan penelitian Salisah, Lidya, dan Defit (2015) di Jurnal Rekayasa dan Manajemen Sistem Informasi, yang berjudul *"Sistem Pakar Penentuan Bakat Anak dengan Menggunakan Metode Forward Chaining"*. Penelitian tersebut menyusun basis pengetahuan awal untuk mengidentifikasi bakat anak TK usia 4-6 tahun berdasarkan standar US Office of Education (USOE) America, mencakup 27 indikator, 83 variabel, dan 33 aturan (*rules*).

Dalam aplikasi **TalentaKu**, basis pengetahuan asli ini diperluas untuk mencakup **empat kelompok usia** yang disesuaikan dengan tahapan perkembangan anak:
1. **Batita** (Usia 3 Tahun)
2. **Prasekolah / TK** (Usia 4-6 Tahun) - *Berbasis Jurnal Asli*
3. **SD Awal** (Usia 7-9 Tahun)
4. **SD Akhir** (Usia 10-12 Tahun)

Metode pengumpulan fakta diubah dari checkbox biner tradisional (terpenuhi/tidak) menjadi **skala Likert 5 poin** (Tidak Pernah, Jarang, Kadang, Sering, Selalu) guna menghasilkan analisis kecenderungan bakat yang lebih halus, dinamis, dan representatif bagi orang tua serta pendidik.

---

## 2. Tujuan Sistem

1. Menyediakan aplikasi web yang mudah diakses bagi orang tua dan pendidik untuk melakukan asesmen mandiri kecenderungan bakat anak dari usia 3 hingga 12 tahun.
2. Mengimplementasikan mesin inferensi *Forward Chaining* dua level untuk menentukan indikator dan kriteria bakat yang terpenuhi berdasarkan input asesmen.
3. Menyediakan dashboard admin komprehensif bagi pengelola untuk memantau data asesmen, melihat statistik, serta mengelola konfigurasi variabel, indikator, aturan, dan parameter sistem lainnya secara dinamis.

---

## 3. Basis Pengetahuan (Knowledge Base)

### 3.1 Struktur Inferensi Dua Level

Sistem pakar menggunakan alur maju (*Forward Chaining*) dengan hierarki berikut:
```
Fakta Jawaban Asesmen (Skala 1-5) 
  ↓ (Dikonversi ke biner berdasarkan nilai ambang/threshold)
Variabel Terpenuhi (True/False)
  ↓ [Rule Level 1: Variabel → Indikator]
Indikator Terpenuhi (True/False)
  ↓ [Rule Level 2: Indikator → Kriteria Bakat]
Kriteria Bakat Terpenuhi (True/False)
```

### 3.2 Kriteria Bakat (6 Kategori Utama)

Terdapat 6 kriteria bakat utama yang dianalisis pada setiap kelompok usia:
- **K1 / TK1 / EK1 / LK1**: Intelektual Umum
- **K2 / TK2 / EK2 / LK2**: Akademik Khusus
- **K3 / TK3 / EK3 / LK3**: Berpikir Kreatif dan Produktif
- **K4 / TK4 / EK4 / LK4**: Kepemimpinan
- **K5 / TK5 / EK5 / LK5**: Seni Visual dan Pertunjukan
- **K6 / TK6 / EK6 / LK6**: Psikomotorik

---

### 3.3 Pemetaan Struktur per Kelompok Usia

#### A. Batita (Usia 3 Tahun)
- **Karakteristik**: 12 Pertanyaan/Variabel (T1-T12), 6 Indikator (TI1-TI6), 6 Kriteria (TK1-TK6)
- **Pemetaan Aturan**:
  - **TI1** (Kemampuan Komunikasi & Bicara Dasar) ← IF T1 AND T2. *Target Kriteria:* **TK1** (Intelektual Umum)
  - **TI2** (Konsep Angka & Warna Dasar) ← IF T3 AND T4. *Target Kriteria:* **TK2** (Akademik Khusus)
  - **TI3** (Imajinasi Bermain Toddler) ← IF T5 AND T6. *Target Kriteria:* **TK3** (Berpikir Kreatif & Produktif)
  - **TI4** (Kepatuhan & Sosialisasi Dasar) ← IF T7 AND T8. *Target Kriteria:* **TK4** (Kepemimpinan)
  - **TI5** (Respon Musik & Estetika Toddler) ← IF T9 AND T10. *Target Kriteria:* **TK5** (Seni Visual & Pertunjukan)
  - **TI6** (Keterampilan Motorik Toddler) ← IF T11 AND T12. *Target Kriteria:* **TK6** (Psikomotorik)

#### B. Prasekolah / TK (Usia 4-6 Tahun - Berbasis Jurnal Asli)
- **Karakteristik**: 83 Pertanyaan/Variabel (C1-C83), 27 Indikator (I1-I27), 6 Kriteria (K1-K6), 33 Aturan (*Rules*)
- **Daftar Indikator (I1-I27)**:
  - *Intelektual Umum*: I1 (Perbendaharaan kata tinggi), I2 (Ingatan kuat), I3 (Penguasaan kata abstrak).
  - *Akademik Khusus*: I4 (Pemikiran abstrak), I5 (Prestasi matematika), I6 (Prestasi sains).
  - *Berpikir Kreatif*: I7 (Keterbukaan terhadap pengalaman), I8 (Standar personal), I9 (Memainkan ide), I10 (Menghadapi resiko), I11 (Kesukaan terhadap kompleksitas), I12 (Toleran ambiguitas), I13 (Image diri positif).
  - *Kepemimpinan*: I14 (Menyatu dengan tugas), I15 (Kepercayaan diri), I16 (Tanggung jawab), I17 (Kerja sama), I18 (Mendominasi).
  - *Seni*: I19 (Adaptasi situasi baru), I20 (Seni visual), I21 (Seni musik), I22 (Drama).
  - *Psikomotorik*: I23 (Motorik kinestetik), I24 (Keterampilan praktik), I25 (Spasial), I26 (Mekanika), I27 (Fisikal).

#### C. SD Awal (Usia 7-9 Tahun)
- **Karakteristik**: 24 Pertanyaan/Variabel (E1-E24), 12 Indikator (EI1-EI12), 6 Kriteria (EK1-EK6)
- **Pemetaan Aturan**:
  - **EK1** (Intelektual Umum) ← IF EI1 (Kemampuan Verbal & Pemahaman Cerita [E1, E2]) AND EI2 (Penalaran Logis & Analitis Awal [E3, E4])
  - **EK2** (Akademik Khusus) ← IF EI3 (Keterampilan Matematika Dasar [E5, E6]) AND EI4 (Minat Observasi Alam & Sains [E7, E8])
  - **EK3** (Berpikir Kreatif & Produktif) ← IF EI5 (Orisinalitas & Pembuatan Karya [E9, E10]) AND EI6 (Pemecahan Masalah & Kreativitas Praktis [E11, E12])
  - **EK4** (Kepemimpinan) ← IF EI7 (Kepemimpinan & Kerjasama Kelompok [E13, E14]) AND EI8 (Kemandirian & Tanggung Jawab Akademik [E15, E16])
  - **EK5** (Seni Visual & Pertunjukan) ← IF EI9 (Menggambar dengan Detail & Proporsi [E17, E18]) AND EI10 (Bakat Musik & Keberanian Tampil [E19, E20])
  - **EK6** (Psikomotorik) ← IF EI11 (Keseimbangan & Kelincahan Fisik [E21, E22]) AND EI12 (Keterampilan Motorik Halus Presisi [E23, E24])

#### D. SD Akhir (Usia 10-12 Tahun)
- **Karakteristik**: 24 Pertanyaan/Variabel (L1-L24), 12 Indikator (LI1-LI12), 6 Kriteria (LK1-LK6)
- **Pemetaan Aturan**:
  - **LK1** (Intelektual Umum) ← IF LI1 (Penalaran Abstrak & Debat Logis [L1, L2]) AND LI2 (Literasi Karangan & Menulis Runtut [L3, L4])
  - **LK2** (Akademik Khusus) ← IF LI3 (Keterampilan Matematika Lanjut [L5, L6]) AND LI4 (Eksperimen Sains & Minat Teknologi [L7, L8])
  - **LK3** (Berpikir Kreatif & Produktif) ← IF LI5 (Inovasi Desain & Proyek Mandiri [L9, L10]) AND LI6 (Apresiasi Estetika & Budaya Kritis [L11, L12])
  - **LK4** (Kepemimpinan) ← IF LI7 (Kepemimpinan Kelompok & Organisasi [L13, L14]) AND LI8 (Sportivitas & Resolusi Konflik Sebaya [L15, L16])
  - **LK5** (Seni Visual & Pertunjukan) ← IF LI9 (Seni Rupa & Media Digital Lanjut [L17, L18]) AND LI10 (Kemahiran Instrumen & Tari Mandiri [L19, L20])
  - **LK6** (Psikomotorik) ← IF LI11 (Kecakapan Atletik & Olahraga Taktis [L21, L22]) AND LI12 (Keterampilan Mekanis & Presisi Fisik [L23, L24])

---

### 3.4 Adaptasi Skala Likert ke Forward Chaining

1. **Ambang Batas Biner (Threshold):** Jawaban bertingkat (1-5) dikonversi ke nilai biner (`true` atau `false`). Variabel dinyatakan terpenuhi (`true`) jika skor jawaban pengguna $\ge$ nilai ambang batas (default: **4** atau kategori *Sering* & *Selalu*). Nilai ambang batas ini dapat diubah secara global melalui menu Pengaturan Admin.
2. **Skor Persentase Indikator & Kriteria:** 
   - Skor indikator dihitung sebagai persentase rata-rata respons variabel penyusunnya (dinormalisasi ke rentang 0-100%).
   - Skor kriteria bakat dihitung dari rata-rata persentase indikator yang menyusunnya.
3. **Status Kriteria Terpenuhi:** Kriteria dianggap terpenuhi secara biner (*Rule Satisfied*) apabila **seluruh** indikator pendukungnya bernilai `true` (memenuhi aturan AND).
4. **Sistem Ranking Fallback:** Hasil asesmen menampilkan 3 kriteria teratas (*Top-3*) berdasarkan skor persentase tertinggi. Jika tidak ada aturan kriteria yang terpenuhi penuh secara biner, sistem akan memberikan hasil klasifikasi sebagai "Kecenderungan Bakat" berdasarkan ranking persentase tersebut.

---

## 4. Arsitektur & Stack Teknologi

### 4.1 Frontend (Sisi Klien)
- **Core Framework**: React 19 + TypeScript + Vite.
- **Styling**: Tailwind CSS (Menggunakan integrasi v4 dengan `@tailwindcss/vite`).
- **UI Components**: `@aejkatappaja/phantom-ui` untuk komponen antarmuka yang modern, responsif, dan konsisten.
- **Routing**: `react-router-dom` v7 untuk manajemen navigasi publik dan area admin.
- **State & Data Store**: `localStorage` (untuk menyimpan token JWT & data login) dan `sessionStorage` (untuk menyimpan ID sesi konsultasi berjalan).

### 4.2 Backend (Sisi Server)
- **Bahasa pemrograman**: Go (Golang) v1.26.
- **Web Framework**: Fiber (Fast HTTP Engine).
- **Database ORM**: GORM (Go Object Relational Mapping).
- **Database**: 
  - **SQLite** (`talentaku.db`) sebagai default database lokal.
  - Mendukung migrasi otomatis ke **PostgreSQL** jika variabel lingkungan `DATABASE_URL` diatur (misal terkoneksi ke database eksternal).
- **Autentikasi**: JWT (JSON Web Token) kustom yang diterbitkan oleh server Go saat login berhasil (baik untuk normal user maupun administrator).
- **Forward Chaining Engine**: Ditulis secara modular sebagai komponen murni dalam Go untuk memproses status relasi variabel, indikator, dan kriteria secara dinamis.

### 4.3 Skema Database (Auto-Migration GORM)
1. `Settings` : Menyimpan konfigurasi dinamis backend seperti nilai threshold.
2. `Variables` : Data 83 variabel prasekolah ditambah variabel untuk kelompok batita dan SD.
3. `Indicators` : Data indikator yang mengelompokkan variabel.
4. `IndicatorVariables` : Relasi pemetaan variabel penyusun indikator.
5. `Criteria` : Kategori bakat yang dilengkapi penjelasan dan saran pengembangan.
6. `CriterionIndicators` : Relasi pemetaan indikator penyusun kriteria.
7. `Children` : Data anak yang diuji (nama, usia, jenis kelamin, sekolah).
8. `Consultations` : Sesi pengujian yang mengaitkan anak, pengguna penguji, dan status asesmen.
9. `ConsultationAnswers` : Jawaban skor (1-5) yang diberikan pada setiap variabel dalam sesi asesmen.
10. `ConsultationResults` : Hasil akhir analisis per kriteria (skor persentase, status aturan terpenuhi, dan ranking).
11. `Users` : Akun pengguna umum (orang tua/guru) yang mendaftar.
12. `AdminUsers` : Akun administrator pengelola sistem pakar.

---

## 5. Fitur Utama & Alur Pengguna

### 5.1 Pengalaman Pengguna Utama (Orang Tua / Guru)
1. **Landing Page**: Pengenalan sistem pakar TalentaKu, deskripsi metode *Forward Chaining*, dan panduan singkat sebelum memulai.
2. **Registrasi & Login**: Akun kustom untuk menyimpan dan melihat riwayat konsultasi anak secara berkala.
3. **Informasi Anak (Child Intake)**: Pengisian nama anak, usia (yang secara otomatis menentukan kelompok instrumen soal), jenis kelamin, dan nama sekolah.
4. **Wizard Asesmen (Wizard Page)**:
   - Pertanyaan disajikan bertahap, dikelompokkan berdasarkan kategori bidang (seperti Bahasa, Kreatif, Matematika, dll).
   - Dilengkapi contoh konkret perilaku anak (*assessment examples*) untuk memandu pilihan penguji.
   - Pilihan jawaban menggunakan radio button skala Likert 5 poin.
5. **Halaman Hasil (Results Page)**:
   - Menampilkan visualisasi Top-3 Bakat/Kecenderungan dengan medali (🥇, 🥈, 🥉).
   - Menampilkan visualisasi persentase kecocokan kriteria bakat.
   - Penjelasan naratif mengenai pengertian kriteria bakat teratas dan rekomendasi aktivitas/saran pengembangan yang aplikatif bagi orang tua.
6. **Riwayat Asesmen**: Halaman riwayat untuk memantau perkembangan asesmen anak di masa lalu dan dapat diunduh/dilihat ulang detail penelusurannya.

### 5.2 Pengalaman Administrator (Dashboard Admin)
1. **Ringkasan Statistik**: Menampilkan jumlah anak terdaftar, total sesi asesmen yang selesai, dan grafik distribusi sebaran bakat anak.
2. **Manajemen Data**:
   - **Anak & Konsultasi**: Memantau data anak yang melakukan asesmen serta melihat detail lembar jawaban lengkap.
   - **Variabel & Indikator**: CRUD data variabel, indikator, dan kategori pertanyaan.
   - **Rule Builder**: Pengelolaan relasi logika inferensi *Forward Chaining* (Variabel → Indikator dan Indikator → Kriteria).
3. **Pengaturan Engine**: Mengonfigurasi parameter internal mesin inferensi, termasuk nilai ambang batas (*threshold*) konversi skala Likert.

---

## 6. Validasi & Integritas Data

- **Penyimpanan Password Aman**: Sandi akun pengguna dan admin disimpan menggunakan algoritma hashing satu arah **Bcrypt**.
- **Pelacakan Inferensi (*Trace Log*)**: Setiap hasil kalkulasi asesmen menyimpan log runtutan pencocokan aturan (*traces*) di database, sehingga admin dapat menelusuri secara presisi mengapa suatu kriteria dianggap terpenuhi atau tidak untuk masing-masing konsultasi.
tatan Validasi Data

Sebelum go-live, tim disarankan memverifikasi ulang 14 variabel K6 (C70-C83) langsung ke jurnal sumber (karena Tabel 8 pada salinan PDF yang digunakan terpotong sebagian), agar label variabel psikomotorik yang ditampilkan ke pengguna akurat dan tidak menggunakan placeholder generik secara permanen.
tatan Validasi Data

Sebelum go-live, tim disarankan memverifikasi ulang 14 variabel K6 (C70-C83) langsung ke jurnal sumber (karena Tabel 8 pada salinan PDF yang digunakan terpotong sebagian), agar label variabel psikomotorik yang ditampilkan ke pengguna akurat dan tidak menggunakan placeholder generik secara permanen.
