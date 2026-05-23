import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

/* ================= GET ALL APPOINTMENTS ================= */
router.get("/", async (req, res) => {
  try {
    const data = await Appointment.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= CREATE APPOINTMENT ================= */
router.post("/", async (req, res) => {
  try {
    const { doctor, date, time } = req.body;

    // CHECK IF SLOT ALREADY BOOKED
    const existing = await Appointment.findOne({
      doctor,
      date,
      time,
    });

    if (existing) {
      return res.status(400).json({
        message: "Slot already booked",
      });
    }

    const newAppointment = new Appointment(req.body);
    await newAppointment.save();

    res.status(201).json(newAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= UPDATE STATUS ================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= DELETE APPOINTMENT ================= */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.json({
      message: "Appointment deleted successfully",
      deleted,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
