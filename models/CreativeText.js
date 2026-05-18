import mongoose from 'mongoose';

const creativeTextSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  content: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('CreativeText', creativeTextSchema);