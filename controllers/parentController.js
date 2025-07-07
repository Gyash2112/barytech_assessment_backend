const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createChildAccount = async (req, res) => {
  const { name, email, parentId } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already in use' });

    const tempPassword = 'Qwerty@1234';
    const hashed = await bcrypt.hash(tempPassword, 10);

    const child = await User.create({
      name,
      email,
      password: hashed,
      role: 'child',
      parentId: parentId,
    });

    // TODO: Send email to child with tempPassword

    res.status(201).json({
      msg: 'Child account created',
      child,
      tempPassword, // show only in dev; hide in prod
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to create child', error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const { id } = req.query;
  try {
    const users = await User.find({ parentId: id }, '-password'); // exclude password
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch users', error: err.message });
  }
};
