const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String
}, { timestamps: true }); 

module.exports = mongoose.model('Task', TaskSchema);
