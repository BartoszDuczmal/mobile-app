import cookieParser from 'cookie-parser';
import 'dotenv/config';
import express from 'express';
import adminRoutes from './routes/admin.js';
import authRoutes from './routes/auth.js';
import commentsRoutes from './routes/comments.js';
import postsRoutes from './routes/posts.js';
import profileRoutes from './routes/profile.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);
app.use('/profile', profileRoutes)
app.use('/admin', adminRoutes)
app.use('/comments', commentsRoutes)

app.use((req, res) => {
    res.status(404).json({ error: 'common.notFound' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'common.internalErr' });
});

const PORT  = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
