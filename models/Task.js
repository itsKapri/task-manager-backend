const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
}); 

module.exports = mongoose.model('Task', TaskSchema);
