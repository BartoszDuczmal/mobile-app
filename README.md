# React Native Expo + Express App

This is a full‑stack mobile application built with **React Native (Expo)** on the frontend and **Node.js (Express)** on the backend. The project includes user authentication, posts, profiles, likes, comments, and basic admin functionality.


## 🚀 Tech Stack

### Frontend

* React Native
* Expo Router (file‑based routing)
* TypeScript
* Expo vector-icons

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Nodemailer (password recovery emails)


## 📱 Mobile App Structure (Expo)

```
app/
 ├─ (tabs)/
 │   ├─ login/
 │   │   ├─ index.tsx
 │   │   ├─ recovery.tsx
 │   │   ├─ resetPassword.tsx
 │   │   └─ changePassword.tsx
 │   ├─ posts/
 │   │   ├─ index.tsx
 │   │   └─ [id]/
 │   │       ├─ index.tsx
 │   │       └─ edit.tsx
 │   ├─ profile/
 │   │   ├─ index.tsx
 │   │   └─ [name]/index.tsx
 │   ├─ publish.tsx
 │   ├─ register.tsx
 │   └─ index.tsx
 └─ _layout.tsx
```


## 🧠 Backend Structure (Express)

```
backend/
 ├─ config/
 │   ├─ db.js
 │   └─ mail.js
 ├─ controllers/
 │   ├─ auth/
 │   │   ├─ login.js
 │   │   ├─ register.js
 │   │   ├─ logout.js
 │   │   ├─ recovery.js
 │   │   └─ resetPass.js
 │   ├─ admin/
 │   │   ├─ block.js
 │   │   └─ unblock.js
 │   └─ comments/
 │       ├─ add.js
 │       ├─ edit.js
 │       └─ delete.js
 ├─ models/
 │   ├─ loginModel.js
 │   └─ postModel.js
 ├─ routes/
 │   ├─ auth.js
 │   ├─ posts.js
 │   ├─ profile.js
 │   └─ admin.js
 ├─ functions/
 │   ├─ checkFunc.js
 │   └─ countLikes.js
 └─ server.js
```


## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/BartoszDuczmal/mobile-app
cd mobile-app
```

### 2. Frontend (Expo)

```bash
cd app
npm install
npx expo start
```

### 3. Database (MySQL)

1. Install **MySQL** locally or use a tool like **XAMPP / MAMP**.
2. Create a new database:

```sql
CREATE DATABASE mobile_app;
```

3. Import the database schema:

```bash
mysql -u your_db_user -p mobile_app < database.sql
```

### 4. Backend (Express)

```bash
cd backend
npm install
npm run dev
```


## 🔐 Environment Variables

Create a `.env` file in the `backend` directory:

```
JWT_KEY=your_jwt_secret

SALT_ROUNDS=10

DB_HOST=localhost
DB_NAME=mobile_app
DB_USER=your_db_user
DB_PASS=your_db_password

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```


## 📄 License

MIT
