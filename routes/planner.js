import express from 'express';
import PlannerEvent from '../models/PlannerEvent.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get planner events for a user, optionally filtered by month
router.get('/', verifyToken, async (req, res) => {
  try {
    const { month } = req.query;
    const query = { userId: req.userId };
    
    if (month) {
      // month is in YYYY-MM format
      query.date = { $regex: `^${month}` };
    }
    
    const events = await PlannerEvent.find(query);
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update planner event
router.post('/', verifyToken, async (req, res) => {
  try {
    const { id, title, description, type, date, completed } = req.body;
    
    if (id) {
      // Update existing
      const updatedEvent = await PlannerEvent.findOneAndUpdate(
        { _id: id, userId: req.userId },
        { title, description, type, date, completed },
        { new: true }
      );
      if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
      return res.json(updatedEvent);
    } else {
      // Create new
      const newEvent = new PlannerEvent({
        userId: req.userId,
        title,
        description,
        type,
        date,
        completed
      });
      await newEvent.save();
      return res.status(201).json(newEvent);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete planner event
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const deletedEvent = await PlannerEvent.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;