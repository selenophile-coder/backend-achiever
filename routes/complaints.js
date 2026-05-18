import express from 'express';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';
import { verifyToken, adminGuard } from '../middleware/auth.js';

const router = express.Router();

// Get all complaints (admin only)
router.get('/', verifyToken, adminGuard, async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add complaint (admin only, but also used by Raise Issue - we'll allow member later)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { userId, text } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const complaint = new Complaint({ userId, userName: `${user.firstName} ${user.lastName}`.trim(), text });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Resolve complaint
router.patch('/:id/resolve', verifyToken, adminGuard, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { resolved: true }, { new: true });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete complaint
router.delete('/:id', verifyToken, adminGuard, async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;