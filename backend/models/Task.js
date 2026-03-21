const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  topic: { type: String, required: true },
  deadline: { type: Date, required: true },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  stage: { type: Number, default: 0, min: 0, max: 3 },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
