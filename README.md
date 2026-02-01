# React Native Expo + Express App

This is a full‑stack mobile application built with **React Native (Expo)** on the frontend and **Node.js (Express)** on the backend. The project includes user authentication, posts, profiles, likes, comments, and basic admin functionality.


## 📚 Features

* **Accounts Management:** Login, registration, session validation and email-based recovery.
* **Post System:** Create, edit, delete, and view posts.
* **Interactions:** Like/unlike posts. _(SOON: Commenting functionality.)_
* **Admin Tools:** Functionality to block/unblock users and delete posts.


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


## 📱 App Structure (Expo)

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


## 📄 License

### MIT License

Copyright (c) 2026 Bartosz Duczmal
