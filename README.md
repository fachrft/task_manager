# 🚀 TaskManager - Modern Task Management App

**TaskManager** adalah aplikasi manajemen tugas (To-Do List) modern yang dibangun dengan fokus pada pengalaman pengguna yang responsif dan keamanan data. Aplikasi ini mendukung fitur kolaborasi publik di mana siapapun bisa melihat daftar tugas yang sedang dikerjakan, namun hanya pemilik tugas yang memiliki kontrol penuh untuk memodifikasi atau menghapusnya melalui dashboard yang aman.

## ✨ Main Features

- **Public Task Board**: Menampilkan semua tugas dari berbagai user secara transparan di halaman utama.
- **Secure Dashboard**: Area privat untuk mengelola tugas pribadi.
- **Full CRUD Ops**: Create, Read, Update (toggle complete), dan Delete tugas.
- **Profile Management**: Update informasi personal (Nama & Email) serta fitur hapus akun permanen.
- **Robust Authentication**: Menggunakan Supabase Auth untuk keamanan tingkat tinggi.
- **Real-time Feedback**: Notifikasi interaktif untuk setiap aksi menggunakan `react-hot-toast`.

---

## 🛠️ Technology Stack

### Frontend & Framework

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: React Hook Form
- **Validation**: Zod
- **Notifications**: React Hot Toast

### Backend & Database

- **Database**: PostgreSQL (Hosted on [Supabase](https://supabase.com/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: Supabase Auth
- **Client Library**: Axios (for API consumption)

---

## 🚀 Getting Started

Ikuti langkah-langkah di bawah ini untuk menjalankan project TaskManager di lingkungan lokal Anda.

### 📋 Prerequisites

Pastikan Anda sudah menginstal:

- [Node.js](https://nodejs.org/) (v18 ke atas)
- [pnpm](https://pnpm.io/) (Recommended)
- Akun [Supabase](https://supabase.com/)

### 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/fachrft/task_manager.git
   cd task_manager
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup Environment Variables**
   Duplikat file `.env.example` menjadi `.env` dan isi dengan kredensial Supabase Anda.
   ```bash
   cp .env.example .env
   ```
   Isi variabel berikut di `.env`:
   - `DATABASE_URL`: Connection string dari Supabase (Transaction Pooler).
   - `DIRECT_URL`: Connection string dari Supabase (Session Pooler).
   - `NEXT_PUBLIC_SUPABASE_URL`: API URL dari Dashboard Supabase.
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`: Anon Key dari Supabase.
   - `SUPABASE_SERVICE_ROLE_KEY`: Service Role Key (diperlukan untuk fungsi admin/sync user).

### 🗄️ Database Setup (Prisma & Supabase)

Setelah variabel environment terisi, jalankan perintah ini untuk sinkronisasi schema database:

1. **Push Prisma Schema**

   ```bash
   npx prisma db push
   ```

   _Atau gunakan `npx prisma migrate dev` jika Anda ingin menyimpan history migrasi._

2. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

### 🏃 Running Locally

Jalankan server pengembangan:

```bash
pnpm dev
# atau
npm run dev
```

Akses aplikasi di: [http://localhost:3000](http://localhost:3000)

---

## 🔌 API Documentation

Semua endpoint API berada di bawah prefix `/api`. Sebagian besar endpoint (kecuali Auth) memerlukan header **Authorization: Bearer <access_token>**.

### 🔐 Authentication

#### Register

`POST /api/users`

- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }
  ```
- **Response (201):** `{"message": "Registration successful!"}`

#### Login

`POST /api/users/login`

- **Request Body:** `{"email": "john@example.com", "password": "password123"}`
- **Response (200):** `{"message": "Login successful!", "user": { ... }, "session": { ... }}`

#### Logout

`POST /api/users/logout`

- **Response (200):** `{"message": "Logout successful"}`

---

### 📝 Tasks

#### Get All Tasks (Public)

`GET /api/tasks`

- **Response (200):** `Array of Task Objects including creator info`

#### Get Task By Id

`GET /api/tasks/:id`

- **Response (200):** `Task Object including creator info`

#### Get My Tasks (Private)

`GET /api/tasks/my-tasks`

- **Header:** `Authorization: Bearer <token>`
- **Response (200):** `Array of Task Objects belonging to current user`

#### Create Task

`POST /api/tasks`

- **Header:** `Authorization: Bearer <token>`
- **Request Body:** `{"title": "Belajar Next.js", "description": "Latihan App Router"}`
- **Response (201):** `{"message": "Task created successfully", "data": { ... }}`

#### Update Task

`PUT /api/tasks/:id`

- **Header:** `Authorization: Bearer <token>`
- **Request Body:** `{"title": "Updated Title", "isCompleted": true}`
- **Response (200):** `{"message": "Task updated successfully", "data": { ... }}`

#### Delete Task

`DELETE /api/tasks/:id`

- **Header:** `Authorization: Bearer <token>`
- **Response (200):** `{"message": "Task deleted successfully"}`

---

### 👤 User Profile

#### Get All Users

`GET /api/users`

- **Response (200):** `Array of User Objects`

#### Get User Profile By ID

`GET /api/users/:id`

- **Response (200):** `User Object (name, email, etc.)`

#### Get Tasks By User ID

`GET /api/users/:id/tasks`

- **Response (200):** `Array of Task Objects belonging to specific user`

#### Update Profile

`PUT /api/users/:id`

- **Header:** `Authorization: Bearer <token>`
- **Request Body:** `{"name": "New Name", "email": "new-email@example.com"}`

#### Delete Account

`DELETE /api/users/:id`

- **Header:** `Authorization: Bearer <token>`

---

## 📬 Postman Collection

Anda dapat mengimpor koleksi Postman kami untuk mencoba API secara langsung:

1. File: `Task Manager.postman_collection.json`
2. Import file tersebut ke Postman Anda.
3. Atur variable `base_url` ke `http://localhost:3000`.

---
