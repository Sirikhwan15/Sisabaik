# SisaBaik - Chapter 10: Integrasi Full Stack SisaBaik dengan Vue dan REST API

Repositori ini berisi pengembangan lanjutan dari backend Express/PostgreSQL (Chapter 8) dan antarmuka Vue 3 (Chapter 9) yang kini telah diintegrasikan menjadi aplikasi web *full-stack* yang utuh untuk proyek **SisaBaik**.

## 🚀 Fitur Utama & Integrasi
- **Autentikasi & Peran Pengguna**: Pendaftaran mandiri sebagai pembeli atau penyedia, login berbasis token JWT (*Bearer token* di memori), serta logout yang mencabut sesi di server[cite: 5].
- **Profil Verifikasi Usaha**: Akun penyedia baru memerlukan peninjauan verifikasi dari operator sebelum dapat mempublikasikan penawaran atau mengelola pesanan[cite: 5, 40].
- **Katalog & Manajemen Penawaran**: Katalog publik dinamis dengan pencarian real-time, filter kategori, paginasi berbasis server, serta pengelolaan penawaran (lengkap dengan foto opsional berformat webp/png/jpeg dan pemeriksaan versi data)[cite: 5, 7, 11].
- **Alur Transaksi & Reservasi Stok**: Pemesanan makanan dengan reservasi stok otomatis di server, alur persetujuan (terima, siap diambil, serah terima selesai, tolak, atau batal), serta dukungan pembayaran di tempat (tunai atau gratis)[cite: 8, 11, 12].
- **Dashboard Agregasi Bisnis**: Perhitungan metrik ringkasan secara akurat berdasarkan cakupan akun masing-masing peran (belanja, penghematan, pendapatan diterima, hingga unit makanan tersalurkan)[cite: 9, 11].

## 🛠️ Tech Stack
- **Frontend**: Vue 3 (Composition API), Vue Router 4, Vite (Development Server & Proxy)[cite: 5, 13, 22]
- **Backend**: Node.js, Express 5, REST API, JWT Authentication[cite: 5, 21]
- **Database**: PostgreSQL (dengan migrasi tambahan untuk kolom foto, versi penawaran, dan status pembayaran)[cite: 5, 17]

## ⚙️ Cara Menjalankan Proyek

### 1. Persiapan Database & Backend
Pastikan PostgreSQL lokal Anda aktif, lalu jalankan migrasi database untuk menambahkan kolom dan tabel pendukung transaksi[cite: 14, 17]:
```bash
npm ci
npm run db:migrate
Jalankan server backend Express (port 3000):
npm run dev

2. Menjalankan FrontendBuka terminal baru, masuk ke direktori frontend, instal dependensi, lalu jalankan server Vite (port 5173):
cd frontend
npm ci
npm run dev
Buka peramban dan akses http://127.0.0.1:5173/.

3. Verifikasi Akun Penyedia (Simulasi Operator)Jika Anda mendaftarkan akun penyedia baru dan statusnya masih menunggu peninjauan, jalankan perintah berikut di terminal backend untuk menyetujuinya:
npm run penyedia:verifikasi email-penyedia@example.test
(Setelah itu, klik tombol "Periksa status" pada halaman profil usaha di antarmuka Vue).
Build Produksi & Preview (Single Origin)Untuk menguji hasil kompilasi produksi di mana frontend dan backend disajikan dalam satu origin pada port 3000:
npm run build
npm run start:local
Lalu akses http://127.0.0.1:3000/.
Tampilan Antarmuka Aplikasi1. Tampilan Mode Pembeli (Memesan)2. Tampilan Mode Penyedia (Menawarkan)
