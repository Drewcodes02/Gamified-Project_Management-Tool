const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  console.log('Authenticating user...');
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Authentication token missing or invalid.');
    return res.status(401).json({ message: 'Authentication token missing or invalid.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // INPUT_REQUIRED {Provide the JWT_SECRET in your .env file}
    req.user = { userId: decoded.userId, username: decoded.username };
    console.log(`User authenticated: ${req.user.username}`);
    next();
  } catch (error) {
    console.error('Error verifying JWT:', error.stack);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = auth;