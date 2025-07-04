const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'Access denied' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // contains id and role
    next();
  } catch (err) {
    console.error(err);
    return res.status(403).json({ msg: 'Invalid or expired token' });
  }
};

// Optional role checker
exports.checkRole = (role) => (req, res, next) => {
  if (req.user.role !== role)
    return res.status(403).json({ msg: 'Access forbidden: Insufficient role' });
  next();
};
