# Panduan Deployment - TalentaKu

Dokumen ini menjelaskan langkah-langkah untuk mendeploy aplikasi **TalentaKu** (Sistem Pakar Identifikasi Bakat Anak) baik di lingkungan lokal maupun ke layanan cloud production seperti **Vercel** menggunakan arsitektur *Multi-Service*.

---

## 1. Arsitektur Proyek
Aplikasi TalentaKu dibagi menjadi dua bagian utama:
* **Frontend**: Aplikasi Single Page Application (SPA) berbasis **React** + **Vite** + **TypeScript**.
* **Backend**: Web API server berkinerja tinggi berbasis **Go** + **Fiber** + **GORM** + **SQLite**.

Dalam skema produksi (Vercel), kedua layanan ini dijalankan bersamaan dengan gateway routing:
* `/` ➔ Mengarah ke frontend (Vite).
* `/_/backend` ➔ Mengarah ke backend (Go API).

---

## 2. Persyaratan Sistem
Sebelum memulai, pastikan perangkat Anda memenuhi syarat berikut:
* **Go** (versi 1.18 atau lebih baru)
* **Node.js** (versi 18 atau lebih baru) & **npm** (versi 9 atau lebih baru)
* Compiler C (GCC/MinGW) jika backend dijalankan dengan CGO diaktifkan untuk SQLite.

---

## 3. Deployment & Pengembangan Lokal

### A. Konfigurasi Backend
1. Masuk ke direktori `backend/`:
   ```bash
   cd backend
   ```
2. Buat file `.env` di dalam folder `backend/` (Anda dapat menyalin dari `.env.example` jika ada):
   ```env
   PORT=8080
   JWT_SECRET=rahasia_super_aman_123
   ```
3. Unduh dependensi backend:
   ```bash
   go mod tidy
   ```
4. Jalankan server backend:
   ```bash
   go run main.go
   ```
   *Server akan berjalan di `http://localhost:8080`.*

### B. Konfigurasi Frontend
1. Masuk ke direktori `frontend/`:
   ```bash
   cd frontend
   ```
2. Instal dependensi node modules:
   ```bash
   npm install
   ```
3. Jalankan server pengembangan lokal (Vite Dev Server):
   ```bash
   npm run dev
   ```
   *Frontend akan berjalan di `http://localhost:5173`. Frontend secara dinamis mendeteksi port `8080` untuk API lokal.*

---

## 4. Deployment ke Vercel (Multi-Service)

Vercel mendukung deployment proyek monorepo dengan banyak servis melalui konfigurasi `vercel.json` di root folder.

### A. File Konfigurasi `vercel.json`
File ini telah disiapkan di direktori root proyek untuk mengarahkan lalu lintas data:
```json
{
    "experimentalServices": {
        "frontend": {
            "entrypoint": "frontend",
            "routePrefix": "/",
            "framework": "vite"
        },
        "backend": {
            "entrypoint": "backend/main.go",
            "routePrefix": "/_/backend",
            "framework": "go"
        }
    }
}
```

### B. Alur Routing API Produksi
Pada saat berjalan di Vercel:
1. Browser melakukan fetch ke path `/_/backend/api/...`
2. Gateway Vercel menangkap prefix `/_/backend` dan mengarahkannya ke folder `backend`.
3. Vercel memotong (*strip*) prefix `/_/backend` sehingga server Go Fiber menerima request murni ke `/api/...`.
4. Deteksi ini dikelola secara dinamis di frontend oleh file `frontend/src/config.ts`.

### C. Langkah Deployment di Vercel
1. Pastikan Anda telah menginstal **Vercel CLI** (opsional) atau memiliki akun **Vercel**.
2. **Melalui Dasbor Vercel (Rekomendasi)**:
   * Hubungkan repositori GitHub/GitLab proyek Anda ke Vercel.
   * Pilih repositori proyek ini.
   * Vercel akan otomatis membaca file `vercel.json` di root dan membagi build menjadi dua servis: `frontend` dan `backend`.
3. **Konfigurasi Environment Variables di Dasbor Vercel**:
   Di tab Settings project Anda di Vercel, tambahkan variabel lingkungan berikut:
   * **Untuk Backend (`backend`)**:
     * `JWT_SECRET` : Isi dengan string acak yang kuat (misal: kunci enkripsi Anda).
     * `PORT` : Biasanya ditangani otomatis oleh Vercel Serverless.
4. Klik **Deploy**. Vercel akan mengompilasi Vite SPA dan mem-build Go serverless function secara otomatis.

---

## 5. Pertimbangan Penting Mengenai Database SQLite di Serverless

Saat ini, backend menggunakan database **SQLite** (`talentaku.db`) yang bertipe *file-based database*.

> [!WARNING]
> **Penting untuk Vercel Serverless**:
> Lingkungan serverless Vercel bersifat **ephemeral** dan **read-only** (kecuali folder `/tmp` yang bersifat sementara). Artinya, database SQLite baru yang disimpan di dalam serverless function akan **terhapus setiap kali container Vercel melakukan restart** (Cold Start).

### Solusi untuk Produksi (Pilihan Alternatif Database):

Untuk deployment skala produksi, Anda disarankan mengganti SQLite dengan salah satu opsi berikut:

#### Pilihan 1: Turso / libSQL (SQLite Cloud-Hosted)
Turso menyediakan database SQLite di cloud yang sangat kompatibel dengan driver SQLite GORM.
1. Buat akun di [Turso.tech](https://turso.tech).
2. Dapatkan Database URL (`libsql://...`) dan Auth Token.
3. Ubah driver database di `backend/db/db.go` untuk menggunakan library `github.com/tursodatabase/go-libsql` atau sejenisnya.

#### Pilihan 2: PostgreSQL (Supabase / Neon / Vercel Postgres)
PostgreSQL adalah pilihan standar industri yang sangat tangguh dan didukur penuh oleh GORM secara langsung.
1. Ubah driver database di `backend/db/db.go`:
   ```go
   import (
       "gorm.io/driver/postgres"
       "gorm.io/gorm"
   )
   
   func InitDB() {
       dsn := os.Getenv("DATABASE_URL")
       db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
       // ...
   }
   ```
2. Tambahkan Environment Variable `DATABASE_URL` di dasbor Vercel.
