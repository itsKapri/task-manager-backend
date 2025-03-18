const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');

const router = express.Router();

// Middleware for authentication
const authenticate = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: 'Invalid token format' });
    }

    const token = parts[1];
    console.log("Extracted Token:", token);

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid token', details: err.message });
    }
};

  

router.post('/', authenticate, async (req, res) => {
    console.log("post call in task");
    console.log("req.user.id", req.user.id);
    console.log("Received request body:", req.body);
  const { title, description } = req.body;
  const newTask = new Task({ userId: req.user.id, title, description });
  await newTask.save();
  res.status(201).json(newTask);
});

router.get('/', authenticate, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

router.get('/:id', authenticate, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });
  res.json(task);
});

router.put('/:id', authenticate, async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.findById(req.params.id);
  if (!task || task.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  task.title = title;
  task.description = description;
  await task.save();
  res.json(task);
});

router.delete('/:id', authenticate, async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.userId.toString() !== req.user.id) return res.status(403).json({ error: 'Unauthorized' });

  await task.deleteOne();
  res.json({ message: 'Task deleted' });
});

module.exports = router;

