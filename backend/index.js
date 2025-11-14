import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import authRoutes from './routes/auth.js';
import categoryRoutes from './routes/category.js';
import productRoutes from './routes/product.js';
import config from "./config.js";
import path from "path";

const app = express();

app.use(express.json());
app.use(cors())
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

mongoose.connect(config.db.url)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});