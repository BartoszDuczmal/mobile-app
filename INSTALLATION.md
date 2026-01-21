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

# Do NOT commit real secrets to the repository
```