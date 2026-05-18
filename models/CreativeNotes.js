import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, default: 'New idea' },
  x: { type: Number, default: 20 },
  y: { type: Number, default: 20 },
  color: { type: String, default: '#ffd9e3' }
});

const creativeNotesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  notes: [noteSchema]
});

export default mongoose.model('CreativeNotes', creativeNotesSchema);