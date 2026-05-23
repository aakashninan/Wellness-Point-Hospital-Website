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
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://wellnesspointhospital.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow tools like Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
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

const PORT = process.env.PORT ;
console.log("MONGO_URI:", process.env.MONGO_URI);

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