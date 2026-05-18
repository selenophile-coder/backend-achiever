import mongoose from 'mongoose';

const plannerEventSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  title: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['deepWork', 'review'], default: 'deepWork' },
  completed: { type: Boolean, default: false }
});

export default mongoose.model('PlannerEvent', plannerEventSchema);