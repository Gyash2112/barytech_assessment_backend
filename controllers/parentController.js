const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createChildAccount = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);

    const child = await User.create({
      name,
      email,
      password: hashed,
      role: 'child',
    });

    res.status(201).json({ msg: 'Child account created', child });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create child', error: err.message });
  }
};
