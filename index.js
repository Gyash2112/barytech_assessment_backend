const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/transaction', transactionRoutes);

// Routes Placeholder
app.get('/', (req, res) => {
  res.send('API Running...');
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB Error:', err));
