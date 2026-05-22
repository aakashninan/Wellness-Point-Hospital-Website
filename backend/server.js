import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import appointmentRoutes from './routes/appointmentRoutes.js';

/* ========================
   CONFIG
======================== */
dotenv.config();

const app = express();

/* ========================
   MIDDLEWARE
======================== */

// CORS setup (React Vite frontend)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// JSON body parser
app.use(express.json());

/* ========================
   ROUTES
======================== */

app.use('/api/appointments', appointmentRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('API Running...');
});

/* ========================
   DATABASE + SERVER START
======================== */

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });