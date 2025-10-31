import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import authRoutes from './routes/auth.js';
import config from "./config.js";

const app = express();

app.use(express.json());
app.use(cors())

app.use('/api/auth', authRoutes);

mongoose.connect(config.db.url)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});