import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/profile', profileRoutes)
app.use('/admin', adminRoutes)

const PORT  = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
