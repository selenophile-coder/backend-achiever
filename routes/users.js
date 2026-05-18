import express from 'express';
import User from '../models/User.js';
import { verifyToken, adminGuard } from '../middleware/auth.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', verifyToken, adminGuard, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update user status (activate/deactivate)
router.patch('/:id/status', verifyToken, adminGuard, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'inactive', 'pending'].includes(status)) return res.status(400).json({ message: 'Invalid status' });
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update fee due (record payment)
router.patch('/:id/fee', verifyToken, adminGuard, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const newFeeDue = Math.max(0, user.feeDue - amount);
    user.feeDue = newFeeDue;
    await user.save();
    res.json({ feeDue: user.feeDue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign/Add fee to user
router.patch('/:id/add-fee', verifyToken, adminGuard, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.feeDue = (user.feeDue || 0) + parseFloat(amount);
    await user.save();
    res.json({ feeDue: user.feeDue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete user
router.delete('/:id', verifyToken, adminGuard, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update join date
router.patch('/:id/join-date', verifyToken, adminGuard, async (req, res) => {
  try {
    const { date } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.createdAt = new Date(date);
    await user.save();
    res.json({ createdAt: user.createdAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;