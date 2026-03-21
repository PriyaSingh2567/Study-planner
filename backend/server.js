const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/studyplanner';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect(DB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
