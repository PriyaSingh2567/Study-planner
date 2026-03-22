const express = require('express');
const Task = require('../models/Task');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId }).sort({ deadline: 1 });
  res.json(tasks);
});

router.post('/', authMiddleware, async (req, res) => {
  const newTask = new Task({ ...req.body, userId: req.userId });
  await newTask.save();
  res.json(newTask);
});

router.put('/:id', authMiddleware, async (req, res) => {
  const updatedTask = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.userId },
    req.body,
    { new: true }
  );
  res.json(updatedTask);
});

router.delete('/:id', authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  res.json({ message: 'Task deleted' });
});

module.exports = router;
