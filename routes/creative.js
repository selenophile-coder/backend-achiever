import express from 'express';
import CreativeText from '../models/CreativeText.js';
import CreativeNotes from '../models/CreativeNotes.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get or create creative text
router.get('/text', verifyToken, async (req, res) => {
  try {
    let doc = await CreativeText.findOne({ userId: req.userId });
    if (!doc) {
      doc = new CreativeText({ userId: req.userId, content: '' });
      await doc.save();
    }
    res.json({ content: doc.content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update creative text
router.put('/text', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;
    const doc = await CreativeText.findOneAndUpdate(
      { userId: req.userId },
      { content, updatedAt: Date.now() },
      { upsert: true, new: true }
    );
    res.json({ content: doc.content });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get sticky notes
router.get('/notes', verifyToken, async (req, res) => {
  try {
    let doc = await CreativeNotes.findOne({ userId: req.userId });
    if (!doc) {
      doc = new CreativeNotes({ userId: req.userId, notes: [] });
      await doc.save();
    }
    res.json({ notes: doc.notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update sticky notes (full replace)
router.put('/notes', verifyToken, async (req, res) => {
  try {
    const { notes } = req.body;
    const doc = await CreativeNotes.findOneAndUpdate(
      { userId: req.userId },
      { notes },
      { upsert: true, new: true }
    );
    res.json({ notes: doc.notes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;