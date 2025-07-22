import cookieParser from 'cookie-parser';
import express from 'express';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
