const jwt = require('jsonwebtoken');

const validateRole = (role) => (req, res, next) => {
  const { coderToken } = req.cookies;

  if (!coderToken) return res.status(401).json({ message: 'Invalid Token' });

  const admin = 'admin';
  if (role !== admin) return res.status(401).json({ message: 'unauthorized' });

  jwt.verify(coderToken, 'secret123', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token denied' });
    req.user = user;
    next();
  })
}

module.exports = { validateRole };