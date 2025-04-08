# Proyek E-commerce MERN

Ini adalah aplikasi web e-commerce full-stack yang dibangun menggunakan teknologi MERN (MongoDB,
Express.js, React, Node.js). Proyek ini terbagi menjadi dua bagian:

- **Frontend**: Terletak di folder `frontend`, dibangun dengan React dan Next.js.
- **Backend**: Terletak di folder `backend`, dibangun dengan Express.js dan MongoDB.

## Daftar Isi

1. Prasyarat
2. Instalasi
   - Clone Repository
   - Mengatur Variabel Lingkungan
   - Menginstal Dependensi
3. Mengisi Database dengan Data Awal
4. Menjalankan Aplikasi
5. Teknologi yang Digunakan

## Prasyarat

Sebelum menjalankan proyek ini, pastikan Anda telah menginstal perangkat lunak berikut di sistem
Anda:

- **Node.js**: Versi 14.x atau lebih tinggi
- **pnpm**: Digunakan sebagai manajer paket

  Anda dapat menginstalnya secara global dengan perintah berikut:

  ```bash
  npm install -g pnpm
  ```

- **MongoDB**: Pastikan MongoDB sudah terinstal dan berjalan secara lokal, atau gunakan MongoDB
  Atlas sebagai solusi berbasis cloud.

## Instalasi

### Clone Repository

Pertama, klon repository ini ke komputer Anda:

```bash
git clone https://github.com/Hsan25/mern-ecommerce.git
cd mern-ecommerce
```

### Mengatur Variabel Lingkungan

Buat file `.env` untuk **backend** dan `.env.local` untuk **frontend**.

#### Contoh `.env` untuk Backend:

Buat file `.env` di dalam folder `backend`:

```bash
cd backend
touch .env
```

Isi file `.env` di backend dengan mengikuti file `.env.example`.


#### Contoh `.env` untuk Frontend:

Buat file `.env` di dalam folder `frontend`:

```bash
cd frontend
touch .env.local
```
Isi file `.env` di frontend dengan mengikuti file `.env.example`. 

### Menginstal Dependensi

Sekarang, instal semua dependensi untuk **frontend** dan **backend**. Jalankan perintah berikut dari
root proyek:

```bash
# Instal dependensi frontend
pnpm install:frontend

# Instal dependensi backend
pnpm install:backend
```

## Mengisi Database dengan Data Awal

Untuk mengisi database dengan data awal (seperti membuat pengguna admin), Anda perlu menjalankan
skrip seed. Pastikan MongoDB sudah berjalan, lalu jalankan perintah berikut di dalam folder
`backend`:

```bash
pnpm seed

# atau
cd backend && pnpm seed
```

Skrip ini akan:

- Membuat pengguna admin awal menggunakan email dan kata sandi yang telah didefinisikan dalam file
  `.env`.

## Menjalankan Aplikasi

Setelah semua konfigurasi selesai, Anda bisa menjalankan frontend dan backend secara bersamaan
menggunakan `pnpm`.

Dari root proyek, jalankan perintah berikut:

```bash
# Menjalankan backend
pnpm dev:backend

# Menjalankan frontend
pnpm dev:frontend
```

Aplikasi ini akan berjalan di:

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:3001`

## Catatan

Untuk menambahkan atau mengedit produk dan data lainnya, Anda harus masuk ke halaman dashboard
sebagai admin:

```
http://localhost:3000/id/dashboard
```

Dokumentasi backend dapat diakses melalui URL berikut:

```
http://localhost:3001/api/docs
```

**untuk pertama kali menjalankan project ini,pastilah anda akan menerima produk kosong dan segalanya juga. jadi di sarankan untuk menambah data dahulu di dashboard (ADMIN) .**

**_Jika Anda menemukan masalah dalam proyek ini, silakan kirim laporan._**

## Peringatan
 **Project ini masih ada celah keamanan, jadi anda harus hati-hati.**

## Teknologi yang Digunakan

- **Frontend**: React, Next.js, TypeScript
- **Backend**: Express.js, Node.js, MongoDB, TypeScript
- **Manajemen State**: React Context
- **Autentikasi**: JWT (JSON Web Token)
- **Database**: MongoDB dengan Mongoose
