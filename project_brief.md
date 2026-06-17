# Project Brief: Sistem Pakar Penentuan Bakat Anak (Forward Chaining)

## 1. Latar Belakang & Referensi

Sistem ini dibangun berdasarkan penelitian Salisah, Lidya, dan Defit (2015) yang dipublikasikan di Jurnal Rekayasa dan Manajemen Sistem Informasi, berjudul "Sistem Pakar Penentuan Bakat Anak dengan Menggunakan Metode Forward Chaining". Penelitian tersebut membangun basis pengetahuan untuk mengidentifikasi bakat anak TK usia 4-6 tahun berdasarkan standar US Office of Education (USOE) America, terdiri dari 27 indikator, 83 variabel, dan 33 rule, dengan akurasi yang diuji terhadap 100 data dari TK Negeri Pembina II Pekanbaru.

Desain UX/UI mengikuti rekomendasi pada `sistempakar.md`, dengan penyesuaian: input konsultasi menggunakan skala Likert 5 poin (Tidak Pernah/Jarang/Kadang/Sering/Selalu) per variabel, bukan checkbox biner seperti pada implementasi asli di jurnal.

## 2. Tujuan Sistem

Membangun aplikasi web yang memungkinkan orang tua/guru melakukan konsultasi mandiri untuk mengidentifikasi kecenderungan bakat anak usia TK (4-6 tahun), menggunakan mesin inferensi forward chaining berbasis basis pengetahuan dari jurnal, sambil menyediakan dashboard admin untuk mengelola variabel, indikator, dan rule tanpa perlu menulis kode.

## 3. Basis Pengetahuan (Knowledge Base)

### 3.1 Struktur Hierarki

```
Variabel (C1-C83)  →  Indikator (I1-I27)  →  Kriteria Bakat (K1-K6)
```

Tiga level forward chaining: variabel teramati (fakta input) memicu rule level 1 menghasilkan indikator, indikator memicu rule level 2 menghasilkan kriteria bakat akhir.

### 3.2 Kriteria Bakat (6 kategori, Tabel 1 jurnal)

| Kode | Kriteria Bakat |
|---|---|
| K1 | Intelektual Umum |
| K2 | Akademik Khusus |
| K3 | Berpikir Kreatif dan Produktif |
| K4 | Kepemimpinan |
| K5 | Seni Visual dan Pertunjukan |
| K6 | Psikomotorik |

### 3.3 Indikator (27 indikator, Tabel 2 jurnal)

| Kode | Indikator |
|---|---|
| I1 | Tingkat perbendaharaan kata yang tinggi |
| I2 | Mempunyai ingatan kuat |
| I3 | Penguasaan kata-kata abstrak |
| I4 | Memiliki pemikiran abstrak |
| I5 | Memiliki prestasi bidang matematika |
| I6 | Memiliki prestasi sains |
| I7 | Keterbukaan terhadap pengalaman |
| I8 | Menetapkan standar personal |
| I9 | Kemampuan memainkan ide-ide |
| I10 | Keinginan untuk menghadapi resiko |
| I11 | Kesukaan terhadap kompleksitas |
| I12 | Toleran terhadap ambiguitas |
| I13 | Image diri yang positif |
| I14 | Kemampuan menyatu dengan tugas |
| I15 | Kepercayaan diri |
| I16 | Tanggung jawab |
| I17 | Kerja sama |
| I18 | Kecenderungan untuk mendominasi |
| I19 | Beradaptasi dengan mudah terhadap situasi baru |
| I20 | Keterbakatan dalam bidang seni visual |
| I21 | Keterbakatan dalam bidang seni musik |
| I22 | Keterbakatan dalam bidang drama |
| I23 | Kemampuan motorik kinestetik |
| I24 | Keterampilan praktik |
| I25 | Keterampilan spasial |
| I26 | Keterampilan mekanika |
| I27 | Keterampilan fisikal |

> Catatan: I19-I22 sebenarnya hasil rule mengarah ke K5 (Seni Visual & Pertunjukan), dan I23-I27 mengarah ke K6 (Psikomotorik) — sesuai pemetaan rule pada Tabel "Aturan" jurnal, meski penamaan deskriptif beberapa indikator (mis. I19 "Beradaptasi dengan mudah") tampak generik di teks asli jurnal. Implementasi mengikuti pemetaan rule apa adanya dari sumber.

### 3.4 Variabel (83 variabel, Tabel 3-8 jurnal)

Dikelompokkan per kriteria bakat:

**K1 — Intelektual Umum (C1-C14, 14 variabel)**
C1 Dapat menirukan kalimat sederhana; C2 Dapat meniru kembali 4-5 urutan kata; C3 Mengulangi kalimat yang sudah didengarnya; C4 Menyanyikan lagu anak-anak lebih dari 20 lagu; C5 Dapat menyebutkan simbol-simbol huruf vokal dan konsonan; C6 Mengucapkan syair lagu sambil diiringi senandung lagunya; C7 Dapat mengelompokkan benda dengan berbagai cara menurut fungsinya; C8 Meniru berbagai lambang huruf vokal dan konsonan; C9 Mengelompokkan benda menurut fungsinya (peralatan makan, mandi, kebersihan); C10 Dapat menggunakan dan menjawab pertanyaan apa, mengapa, dimana, berapa, bagaimana; C11 Bercerita tentang gambar yang disediakan atau dibuat sendiri; C12 Bercerita menggunakan kata ganti aku, saya, kamu, mereka; C13 Menceritakan pengalaman/kejadian secara sederhana; C14 Memberikan keterangan/informasi tentang suatu hal.

**K2 — Akademik Khusus (C15-C25, 11 variabel)**
C15 Dapat menyebutkan urutan bilangan 1-10; C16 Dapat menunjuk lambang bilangan 1-10; C17 Meniru lambang bilangan 1-10; C18 Mengenal lambang bilangan 1-20; C19 Membedakan dan membuat dua kumpulan benda berdasarkan kuantitasnya; C20 Mengenal perbedaan benda berdasarkan bentuknya; C21 Mencoba dan menceritakan proses pencampuran warna; C22 Mencoba dan menceritakan proses benda dimasukkan ke air (terapung, melayang, tenggelam); C23 Menceritakan macam-macam bunyi; C24 Menceritakan macam-macam rasa; C25 Menceritakan macam-macam bau.

**K3 — Berpikir Kreatif dan Produktif (C26-C48, 23 variabel)**
C26 Mau mengungkapkan pendapat secara sederhana; C27 Menjawab pertanyaan tentang informasi/keterangan; C28 Menyapa teman dan orang lain; C29 Mengucapkan salam; C30 Selalu mengucapkan terima kasih jika memperoleh sesuatu; C31 Mengekspresikan perasaannya (marah, sedih, gembira, dll); C32 Membuat perencanaan kegiatan yang dilakukan anak; C33 Mampu mengambil keputusan secara sederhana; C34 Menggambar bebas dengan berbagai media; C35 Mau menunjukkan perbuatan yang benar dan yang salah; C36 Suka menolong; C37 Mau bermain dengan teman sebaya tanpa membedakan warna kulit, keturunan, rambut, agama; C38 Menghargai hasil karya teman/orang lain; C39 Menghargai keunggulan teman/orang lain; C40 Mengajak teman untuk bermain; C41 Mau menolong dan memberi maaf; C42 Dapat hidup berdampingan dengan teman agama lain; C43 Memuji teman atau orang lain; C44 Berpakaian rapi dan sopan; C45 Menghormati guru, orang tua dan orang yang lebih tua; C46 Mendengarkan dan memperhatikan teman yang berbicara; C47 Memelihara hasil karya sendiri; C48 Mentaati aturan permainan.

**K4 — Kepemimpinan (C49-C62, 14 variabel)**
C49 Berani bertanya dan menjawab pertanyaan; C50 Bertanggung jawab akan tugasnya; C51 Melaksanakan tugas sendiri sampai selesai; C52 Melakukan 3-5 perintah secara berurutan dengan benar; C53 Dapat melaksanakan tugas kelompok; C54 Dapat bekerja sama dengan teman; C55 Mau bermain dengan teman; C56 Saling membantu sesama teman; C57 Mau membantu memecahkan perselisihan/permasalahan; C58 Mau berbagi dengan teman; C59 Mau meminjamkan miliknya; C60 Sabar menunggu giliran; C61 Mengendalikan emosi dengan cara wajar; C62 Dapat menerima kritik.

**K5 — Seni Visual dan Pertunjukan (C63-C69, 7 variabel)**
C63 Melukiskan apa yang dilihat, didengar dalam sebuah kertas; C64 Menggambar bebas dari bentuk dasar titik, garis, lingkaran, segitiga, segiempat; C65 Dapat memainkan alat musik (angklung, piano); C66 Dapat memahami tangga nada; C67 Mengekspresikan gerakan sesuai dengan syair lagu/cerita, iringan musik/lagu; C68 Mengekspresikan diri dalam gerakan; C69 Mampu bermain peran.

**K6 — Psikomotorik (C70-C83, 14 variabel)**
> Catatan: teks Tabel 8 pada jurnal terpotong (judul tabel dan deskripsi C70-C83 tidak tercetak penuh di salinan PDF), tetapi rule No. 28-33 mengonfirmasi keberadaan dan pengelompokan C70-C83 ke dalam I23-I27 lalu K6. Saat implementasi/seeding, 14 variabel ini perlu diverifikasi ulang ke jurnal asli (atau sumber sekunder yang mengutip tabel yang sama) sebelum go-live, dan untuk sementara diberi placeholder label "Variabel psikomotorik C70" dst. agar struktur rule tetap utuh dan dapat diuji.

### 3.5 Rule (33 rule, dua level forward chaining)

**Level 1: Variabel → Indikator**

| No | Rule |
|---|---|
| 1 | IF C1 AND C2 AND C3 THEN I1 |
| 2 | IF C4 AND C5 AND C6 AND C7 AND C8 AND C9 THEN I2 |
| 3 | IF C10 AND C11 AND C12 AND C13 AND C14 THEN I3 |
| 5 | IF C15 AND C16 AND C17 AND C18 THEN I4 |
| 6 | IF C19 AND C20 AND C21 AND C22 AND C23 AND C24 AND C25 THEN I5 |
| 8 | IF C26 AND C27 THEN I6 |
| 9 | IF C28 AND C29 AND C30 AND C31 AND C32 THEN I7 |
| 10 | IF C33 AND C34 THEN I8 |
| 11 | IF C35 AND C36 THEN I9 |
| 12 | IF C37 AND C38 AND C39 AND C40 THEN I10 |
| 13 | IF C41 AND C42 AND C43 THEN I11 |
| 14 | IF C44 AND C45 AND C46 THEN I12 |
| 15 | IF C47 AND C48 THEN I13 |
| 17 | IF C49 AND C50 THEN I14 |
| 18 | IF C51 AND C52 THEN I15 |
| 19 | IF C53 AND C54 AND C55 AND C56 AND C57 THEN I16 |
| 20 | IF C58 AND C59 THEN I17 |
| 21 | IF C60 AND C61 AND C62 THEN I18 |
| 23 | IF C63 AND C64 THEN I19 |
| 24 | IF C65 AND C66 THEN I20 |
| 25 | IF C67 AND C68 THEN I21 |
| 26 | IF C69 THEN I22 |
| 28 | IF C70 AND C71 AND C72 THEN I23 |
| 29 | IF C73 AND C74 THEN I24 |
| 30 | IF C75 AND C76 AND C77 THEN I25 |
| 31 | IF C78 AND C79 AND C80 AND C81 THEN I26 |
| 32 | IF C82 AND C83 THEN I27 |

**Level 2: Indikator → Kriteria Bakat**

| No | Rule |
|---|---|
| 4 | IF I1 AND I2 AND I3 THEN K1 |
| 7 | IF I4 AND I5 THEN K2 |
| 16 | IF I6 AND I7 AND I8 AND I9 AND I10 AND I11 AND I12 AND I13 THEN K3 |
| 22 | IF I14 AND I15 AND I16 AND I17 AND I18 THEN K4 |
| 27 | IF I19 AND I20 AND I21 AND I22 THEN K5 |
| 33 | IF I23 AND I24 AND I25 AND I26 AND I27 THEN K6 |

### 3.6 Adaptasi Skala Likert ke Forward Chaining

Jurnal asli menggunakan input biner (variabel "terpenuhi" atau "tidak", lewat checkbox). Karena UI yang dipilih menggunakan skala Likert 5 poin per variabel (Tidak Pernah=1, Jarang=2, Kadang=3, Sering=4, Selalu=5), diperlukan aturan konversi sebelum forward chaining murni AND-rule dijalankan:

1. **Threshold biner per variabel.** Setiap respons diberi skor 1-5. Variabel dianggap "terpenuhi" (TRUE) jika skor ≥ 4 (Sering/Selalu). Threshold ini dikonfigurasi di level sistem (bukan hardcode), dapat diubah admin di pengaturan engine.
2. **Skor indikator (untuk persentase hasil).** Selain status TRUE/FALSE biner untuk keperluan rule AND klasik, sistem menghitung skor persentase per indikator = rata-rata skor variabel penyusunnya dinormalisasi ke skala 0-100%, dipakai untuk menampilkan "92%", "81%", dst. pada halaman hasil (sesuai contoh UX di `sistempakar.md`).
3. **Skor kriteria bakat.** Skor kriteria = rata-rata skor indikator penyusunnya. Kriteria bakat dengan rule level 2 yang "terpenuhi penuh" (semua indikator TRUE secara biner) ditandai sebagai hasil utama; jika tidak ada yang terpenuhi penuh, sistem menampilkan ranking berdasarkan skor persentase tertinggi sebagai fallback, dengan label "Kecenderungan" bukan "Bakat Teridentifikasi".
4. **Mode dual-result.** Halaman hasil tetap menampilkan ranking top-3 kriteria berbasis skor (untuk UX yang informatif, sesuai desain medali emas/perak/perunggu), sementara halaman detail/transparansi (riwayat konsultasi, visualisasi rule admin) menunjukkan status biner rule mana yang TRUE/FALSE secara eksak — menjaga validitas metode forward chaining sambil tetap memberi UX yang kaya.

## 4. Arsitektur Teknis

### 4.1 Stack

**Frontend**
- Vite + TypeScript + React
- Tailwind CSS untuk styling
- shadcn/ui untuk komponen UI
- Framer Motion untuk animasi transisi antar pertanyaan
- React Hook Form + Zod untuk form dan validasi
- TanStack Query untuk data fetching dan sinkronisasi state server
- React Router untuk routing (publik vs admin)

**Backend**
- Golang (disarankan framework ringan: Fiber atau Echo; final pilihan menyesuaikan preferensi tim)
- Supabase sebagai database (PostgreSQL) dan penyimpanan
- JWT untuk autentikasi admin (role-based: superadmin/admin)
- Supabase Auth bisa dimanfaatkan langsung untuk admin login, atau backend Go menerbitkan JWT sendiri dan memvalidasi terhadap tabel `admin_users` di Supabase — keputusan ini dibahas lebih lanjut di tahap technical design, karena keduanya valid tergantung preferensi kontrol penuh vs kecepatan setup.
- Forward chaining engine ditulis sebagai modul Go murni (bukan rule engine eksternal), karena jumlah rule (33) relatif kecil dan terstruktur dua level — custom engine lebih mudah dikontrol dan divisualisasikan untuk dashboard transparansi.

### 4.2 Skema Data (Supabase/PostgreSQL)

Tabel inti yang diperlukan:

- `variables` (kode C1-C83, label, kriteria_id FK)
- `indicators` (kode I1-I27, label)
- `indicator_variables` (relasi many-to-many: indikator butuh variabel mana, dengan urutan tampil)
- `criteria` (kode K1-K6, label, deskripsi, kekuatan/saran template untuk hasil)
- `criteria_indicators` (relasi many-to-many: kriteria butuh indikator mana)
- `children` (data anak: nama, tanggal lahir/usia, jenis kelamin, sekolah, orang tua/guru pencatat)
- `consultations` (sesi konsultasi: child_id, status, created_at, completed_at)
- `consultation_answers` (consultation_id, variable_id, skor 1-5)
- `consultation_results` (consultation_id, criteria_id, skor_persentase, status_rule_terpenuhi boolean, ranking)
- `admin_users` (untuk auth: email, password_hash, role)
- `settings` (threshold konversi Likert→biner dan konfigurasi engine lain, dikelola admin)

### 4.3 Forward Chaining Engine (Backend)

Alur eksekusi saat pengguna submit jawaban konsultasi:

1. Terima seluruh jawaban skala 1-5 per variabel dari frontend.
2. Konversi setiap variabel ke status biner berdasarkan threshold di tabel `settings`.
3. Evaluasi rule level 1 (variabel → indikator): untuk setiap indikator, cek apakah semua variabel penyusun (dari `indicator_variables`) berstatus TRUE; sekaligus hitung skor persentase rata-rata.
4. Evaluasi rule level 2 (indikator → kriteria): untuk setiap kriteria, cek apakah semua indikator penyusun (dari `criteria_indicators`) berstatus TRUE; sekaligus hitung skor persentase rata-rata dari skor indikator.
5. Urutkan kriteria berdasarkan skor persentase (descending) untuk ranking hasil; tandai status biner rule per kriteria untuk keperluan transparansi.
6. Simpan jejak lengkap (variabel mana TRUE/FALSE, indikator mana terpenuhi, kriteria mana terpenuhi) ke `consultation_results` dan tabel pendukung, agar dapat ditelusuri ulang di halaman "Lihat Detail" riwayat konsultasi dan visualisasi rule admin.
7. Kembalikan response berisi ranking top-3 kriteria dengan skor, penjelasan, kekuatan, dan saran (dari template di tabel `criteria`).

## 5. Desain UI/UX

Mengacu pada `sistempakar.md`, dengan dua pengalaman terpisah: pengguna (orang tua/guru) dan admin.

### 5.1 Flow Pengguna

```
Landing Page
   ↓
Input Data Anak
   ↓
Mulai Konsultasi
   ↓
Pertanyaan per kategori (Bahasa, Matematika, Kreativitas,
Kepemimpinan, Seni, Psikomotorik) — satu pertanyaan per layar
   ↓
Forward Chaining Engine (backend)
   ↓
Halaman Hasil (ranking top-3, persentase, penjelasan, saran)
   ↓
Riwayat Konsultasi (tersimpan, bisa dilihat detail kapan saja)
```

Pengguna tidak pernah melihat rule mentah; mereka hanya melihat pertanyaan berbasis skala Likert dan hasil akhir yang sudah diolah menjadi narasi.

### 5.2 Kategori Pertanyaan

Karena total variabel 83 buah, pertanyaan dikelompokkan per kriteria bakat agar tidak membebani pengguna, sejalan dengan pendekatan di `sistempakar.md`:

1. Data Anak (form awal, bukan pertanyaan skala)
2. Bahasa & Intelektual Umum (terkait K1, 14 pertanyaan)
3. Akademik Khusus (terkait K2, 11 pertanyaan)
4. Kreativitas & Sosial (terkait K3, 23 pertanyaan)
5. Kepemimpinan (terkait K4, 14 pertanyaan)
6. Seni Visual & Pertunjukan (terkait K5, 7 pertanyaan)
7. Psikomotorik (terkait K6, 14 pertanyaan)
8. Hasil

Setiap kategori didahului transisi singkat ("Sekarang kita masuk ke bagian Musik & Seni") agar pengguna merasa progresnya terstruktur, bukan 83 pertanyaan datar tanpa konteks.

### 5.3 Komponen Pertanyaan (Wizard)

Setiap pertanyaan ditampilkan satu per layar dengan:
- Indikator progres "Pertanyaan X dari 83" plus progress bar persentase
- Teks pertanyaan dikonversi dari label variabel menjadi kalimat tanya natural (misal variabel "Suka menolong" → "Apakah anak suka menolong teman?")
- 5 pilihan radio: Tidak Pernah / Jarang / Kadang / Sering / Selalu
- Transisi halus antar pertanyaan menggunakan Framer Motion
- Tombol kembali untuk koreksi jawaban sebelumnya

### 5.4 Halaman Hasil

Mengikuti contoh di `sistempakar.md`:
- Ranking top-3 kriteria bakat dengan medali (🥇🥈🥉) dan persentase skor
- Penjelasan naratif per kriteria teratas (dari template di tabel `criteria`)
- Daftar kekuatan yang teridentifikasi (indikator-indikator yang terpenuhi)
- Saran pengembangan (aktivitas yang disarankan, dari template)
- Jika tidak ada kriteria yang "terpenuhi penuh" secara rule biner, tampilkan label "Kecenderungan Tertinggi" dengan disclaimer bahwa hasil bersifat indikatif, mendorong konsultasi lanjutan dengan psikolog anak.

### 5.5 Riwayat Konsultasi

Tabel berisi nama anak, tanggal konsultasi, hasil utama, dan aksi "Lihat Detail" yang membuka:
- Seluruh jawaban yang diberikan
- Status rule yang terpenuhi per level (variabel→indikator, indikator→kriteria)
- Alasan sistem memilih bakat tersebut, ditulis dalam bahasa natural berdasarkan rule yang aktif

### 5.6 Dashboard Admin

```
Dashboard
├── Anak              (lihat semua data anak terdaftar)
├── Konsultasi         (monitoring semua sesi konsultasi)
├── Variabel           (CRUD 83 variabel C1-C83)
├── Indikator          (CRUD 27 indikator I1-I27, mapping ke variabel)
├── Rule               (Rule Builder visual untuk 33 rule)
├── Hasil              (kelola template penjelasan/saran per kriteria)
├── Laporan            (statistik agregat: distribusi bakat, jumlah konsultasi)
├── Pengaturan         (threshold Likert→biner, konfigurasi engine)
└── User               (kelola admin_users, role-based access)
```

**Rule Builder** dirancang sebagai UI kondisi visual (bukan tabel mentah atau syntax editor):
```
IF
[I6] = Terpenuhi
AND
[I7] = Terpenuhi
AND
[I8] = Terpenuhi
...
THEN
K3 - Berpikir Kreatif dan Produktif

[+ Tambah Kondisi]
```

**Visualisasi Rule** untuk transparansi proses inferensi, menampilkan rule mana yang aktif/tidak aktif untuk sesi konsultasi tertentu, dengan tanda centang (✓) untuk kondisi terpenuhi dan tanda silang (✗) untuk yang tidak.

### 5.7 Sistem Warna

Mengikuti palet pendidikan dan ramah anak dari `sistempakar.md`:

| Token | Hex | Penggunaan |
|---|---|---|
| Primary | #4F46E5 | Aksi utama, navigasi aktif |
| Secondary | #06B6D4 | Aksen, highlight kategori |
| Success | #10B981 | Status terpenuhi, hasil positif |
| Warning | #F59E0B | Peringatan, status belum lengkap |
| Background | #F8FAFC | Latar belakang utama |

### 5.8 Role-Based Access (Admin)

Dengan auth lengkap (JWT + role-based), dirancang minimal dua role:
- **Superadmin**: akses penuh termasuk kelola User, Pengaturan engine, dan Rule Builder
- **Admin**: akses ke Anak, Konsultasi, Hasil, Laporan, namun tidak dapat mengubah struktur Rule/Variabel/Indikator (mencegah basis pengetahuan berubah tanpa kontrol)

Skema ini dapat disederhanakan di iterasi awal jika tim kecil, namun struktur tabel `admin_users.role` sudah disiapkan agar pemisahan ini mudah diaktifkan kapan saja.

## 6. Lingkup Iterasi Awal (MVP) vs Lanjutan

**MVP (wajib untuk versi pertama):**
- Flow pengguna lengkap: landing, input data anak, wizard konsultasi 83 pertanyaan terkategori, forward chaining engine, halaman hasil, riwayat konsultasi
- Admin: login (JWT + role), CRUD Variabel, CRUD Indikator, Rule Builder, monitoring Konsultasi, Laporan dasar
- Seed data awal berisi seluruh 83 variabel, 27 indikator, 33 rule dari jurnal (dengan catatan placeholder untuk C70-C83 yang perlu verifikasi ulang ke sumber asli)

**Lanjutan (opsional, fase berikutnya):**
- Visualisasi rule interaktif (diagram pohon inferensi) untuk admin
- Export laporan PDF/Excel
- Multi-bahasa (jika dibutuhkan untuk ekspansi luar Indonesia)
- A/B testing threshold Likert→biner berdasarkan data riil untuk kalibrasi ulang akurasi sistem

## 7. Catatan Validasi Data

Sebelum go-live, tim disarankan memverifikasi ulang 14 variabel K6 (C70-C83) langsung ke jurnal sumber (karena Tabel 8 pada salinan PDF yang digunakan terpotong sebagian), agar label variabel psikomotorik yang ditampilkan ke pengguna akurat dan tidak menggunakan placeholder generik secara permanen.
