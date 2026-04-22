# 🐦 Flappy Clone

<div align="center">
  <img src="screenshot/gambar.png" alt="Main Menu Flappy Clone" width="800"/>
  
  <br />
  
  <img src="https://img.shields.io/badge/Status-Completed-success" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-blue" alt="License" />
  <img src="https://img.shields.io/badge/Version-1.0.0-orange" alt="Version" />
</div>

<br />

## 📖 Tentang Proyek

**Flappy Clone** adalah sebuah proyek game arcade 2D kasual yang dibuat sebagai tribute (penghormatan) untuk game legendaris *Flappy Bird*. Proyek ini dikembangkan dengan fokus pada mekanik fisika sederhana (gravitasi dan lompatan), deteksi tabrakan (*collision detection*), serta manajemen UI (User Interface) yang interaktif. 

Tujuan utama dari repository ini adalah sebagai bahan pembelajaran, portofolio pengembangan game, dan template yang bisa dikembangkan lebih lanjut oleh komunitas open-source.

---

## 📑 Daftar Isi
- [Fitur Game](#-fitur-game)
- [Mekanik & Kontrol](#-mekanik--kontrol)
- [Struktur Folder](#-struktur-folder)
- [Cara Instalasi & Menjalankan Game](#-cara-instalasi--menjalankan-game)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Rencana Pengembangan (Roadmap)](#-rencana-pengembangan-roadmap)
- [Cara Berkontribusi](#-cara-berkontribusi)
- [Lisensi & Kredit](#-lisensi--kredit)

---

## ✨ Fitur Game

Game ini telah dikembangkan dengan berbagai fitur kustomisasi untuk meningkatkan pengalaman bermain:

### 1. Sistem Tema Peta (Map Themes)
Pemain dapat mengubah suasana visual game sebelum mulai bermain:
* ☁️ **Classic:** Tampilan siang hari dengan langit biru cerah, awan, dan nuansa nostalgia.
* 🌙 **Night:** Tampilan malam hari yang gelap, menuntut fokus ekstra pada rintangan.
* 🏜️ **Desert:** Tampilan gurun pasir dengan palet warna hangat dan tanah gersang.

### 2. Tingkat Kesulitan Dinamis (Difficulty Levels)
Terdapat 3 mode yang memengaruhi kecepatan rintangan dan jarak antar pipa:
* 🟢 **EASY:** Celah rintangan sangat lebar dan kecepatan permainan lebih lambat. Sangat direkomendasikan untuk pemula.
* 🟠 **NORMAL:** Kecepatan dan celah rintangan standar, meniru tingkat kesulitan game aslinya.
* 🔴 **HARD:** Celah rintangan sangat sempit dan kecepatan permainan lebih tinggi. Menguji refleks maksimal pemain.

### 3. Fitur Tambahan
* 🏆 **Sistem Skor & High Score:** Menyimpan rekor skor tertinggi pemain (menggunakan *Local Storage / Save File*).
* 🎨 **Pixel/Vector Art Style:** Menggunakan grafis 2D yang bersih dan memanjakan mata.

---

## 🎮 Mekanik & Kontrol

**Tujuan Game:** Terbang sejauh mungkin melewati celah di antara pipa-pipa tanpa menyentuhnya atau jatuh ke tanah.

**Kontrol (Mendukung Multi-Input):**
* **Keyboard:** Tekan `[Spasi]` atau `[Panah Atas]` untuk mengepakkan sayap.
* **Mouse:** `[Klik Kiri]` pada area game untuk mengepakkan sayap.
* **Touch (Mobile):** Ketuk layar di mana saja (jika dimainkan di perangkat sentuh).

---

## 📁 Struktur Folder

*(Catatan: Sesuaikan struktur folder ini dengan proyek asli Anda)*

```text
📦 flappy-clone
 ┣ 📂 assets/
 ┃ ┣ 📂 images/       # Sprite burung, background, pipa, UI
 ┃ ┣ 📂 sounds/       # Efek suara (lompat, skor, tabrakan)
 ┃ ┗ 📂 fonts/        # Font retro/pixel yang digunakan di UI
 ┣ 📂 src/
 ┃ ┣ 📜 main.js       # Logika utama game (Game Loop)
 ┃ ┣ 📜 player.js     # Logika fisika burung (gravitasi, lompatan)
 ┃ ┣ 📜 obstacle.js   # Pembuat (spawner) rintangan pipa
 ┃ ┗ 📜 ui.js         # Pengatur menu, skor, dan tombol
 ┣ 📜 index.html      # Halaman utama game
 ┣ 📜 style.css       # Styling untuk container game
 ┗ 📜 README.md       # Dokumentasi proyek
