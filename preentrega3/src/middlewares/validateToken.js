const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
  const { coderToken } = req.cookies;
  console.log(coderToken);
  if (!coderToken) return res.status(401).json({ message: 'you need a valid token' });

  jwt.verify(coderToken, 'secret123', (err, user) => {
    if (err) return res.status(403).json({ message: 'Token denied' });
    req.user = user;
    next();
  });
};

module.exports = validateToken;