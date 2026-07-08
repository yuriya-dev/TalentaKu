# Admin Login Page Design Specification

## Objective

Buat halaman **Admin Login** dengan desain modern, minimalis, profesional, dan mengikuti identitas visual website yang sudah ada.

JANGAN membuat halaman registrasi.
JANGAN menambahkan tombol Sign Up.
Halaman ini hanya digunakan untuk autentikasi Admin.

---

# Design Style

Gunakan style yang sama dengan website yang sudah ada.

- Warna utama mengikuti CSS Variables/theme website.
- Jangan membuat palet warna baru.
- Gunakan primary color yang sudah dipakai website.
- Gunakan background, card, button, dan typography yang konsisten.

Tema yang diinginkan:

- Modern
- Clean
- Soft Shadow
- Rounded Corner
- Glass / Soft Card
- Minimal
- Premium

---

# Layout

Desktop menggunakan split screen 50 : 50

--------------------------------------------------------
| Illustration             | Login Card               |
|                           |                          |
|                           |      Logo               |
|                           |                          |
|                           |    Admin Login          |
|                           |                         |
|                           | Username               |
|                           | Password               |
|                           | Remember Me            |
|                           | Forgot Password        |
|                           |                         |
|                           | Login Button           |
|                           |                         |
--------------------------------------------------------

Mobile

Logo

Admin Login

Username

Password

Remember me

Forgot password

Login Button

---

# Left Section

Tampilkan ilustrasi modern seperti workspace.

Bukan gambar random.

Gunakan ilustrasi:

- komputer
- dashboard
- admin workspace
- analytics
- server
- monitoring
- developer office

Style:

- soft 3D illustration
- pastel
- clean

Tambahkan sedikit gradient background.

Jangan terlalu ramai.

---

# Right Section

Gunakan card putih dengan shadow lembut.

Border Radius:

20-28px

Padding besar.

Posisi center secara vertikal.

---

# Logo

Logo website berada paling atas.

Jika logo tersedia gunakan logo tersebut.

Jika belum tersedia gunakan text logo sementara.

---

# Heading

Title:

Admin Login

Subtitle:

Silakan masuk untuk mengakses Dashboard Admin.

Typography:

Bold

Modern

Tidak terlalu besar.

---

# Login Form

Field:

Username / Email

Password

Password memiliki icon show / hide.

Semua input:

Rounded

Soft border

Focus state mengikuti warna primary website.

Placeholder berwarna abu-abu.

---

# Remember Me

Checkbox kecil.

Label:

Remember Me

---

# Forgot Password

Link kecil.

Posisi kanan.

Warna mengikuti primary color.

---

# Login Button

Button full width.

Height:

48-52px

Rounded.

Gunakan warna primary website.

Hover:

lebih gelap sedikit.

Active:

sedikit mengecil.

Loading state:

Spinner.

---

# Validation

Jika field kosong tampilkan error di bawah input.

Contoh:

Username wajib diisi.

Password wajib diisi.

---

# Loading

Saat login:

Disable button.

Tampilkan spinner.

Text berubah menjadi

Signing in...

---

# Error Alert

Jika login gagal tampilkan alert modern.

Contoh:

Username atau password salah.

Gunakan warna danger yang sudah ada.

---

# Success

Jika login berhasil

Redirect ke Dashboard.

Tambahkan animasi fade.

---

# Background

Gunakan gradient lembut.

Jangan menggunakan background gelap.

Gunakan aksen sesuai warna website.

Tambahkan blur shape di background agar lebih premium.

---

# Animation

Gunakan animasi halus.

- Fade In
- Slide Up
- Button Hover
- Input Focus
- Card Fade

Durasi sekitar

200-300ms

---

# Responsive

Desktop

Split layout.

Tablet

40 : 60

Mobile

Single column.

Ilustrasi dipindahkan ke atas atau disembunyikan jika ruang sempit.

Form tetap berada di tengah.

---

# Accessibility

- Label setiap input
- Keyboard friendly
- Focus visible
- Kontras warna sesuai WCAG
- Tombol dapat diakses menggunakan Enter

---

# Components

Gunakan komponen yang reusable.

Contoh:

components/

LoginCard

InputField

PasswordInput

ButtonPrimary

Checkbox

Alert

Logo

---

# Files Structure

pages/

admin/

login.php

assets/

css/

admin-login.css

js/

admin-login.js

components/

login-card.php

input.php

button.php

---

# Coding Rules

- HTML5 Semantic
- CSS Modular
- JavaScript terpisah
- Tidak menggunakan inline style
- Tidak menggunakan inline JavaScript
- Gunakan class naming yang konsisten
- Responsive terlebih dahulu
- Mudah dikembangkan

---

# Visual Reference

Ikuti komposisi seperti contoh berikut:

- Ilustrasi di sisi kiri.
- Card login besar di sisi kanan.
- Card putih dengan sudut membulat.
- Background gradient lembut.
- Shadow halus.
- Layout terasa lapang (whitespace yang cukup).
- Fokus utama berada pada form login.
- Tidak ada elemen registrasi, social login, atau informasi yang tidak diperlukan.

---

# Do Not

Jangan membuat:

- Register
- Sign Up
- Google Login
- Facebook Login
- GitHub Login
- Social Login
- Create Account
- Terms and Conditions
- Privacy Policy
- Footer yang ramai
- Banner promosi

Halaman ini khusus untuk autentikasi Admin.

---

# Final Goal

Hasil akhir harus terlihat seperti halaman login admin profesional dengan nuansa modern dan premium, terinspirasi oleh layout referensi (ilustrasi di kiri dan form login di kanan), tetapi seluruh warna, tipografi, ikon, tombol, serta identitas visual mengikuti tema website yang sudah ada agar tetap konsisten dengan keseluruhan aplikasi.