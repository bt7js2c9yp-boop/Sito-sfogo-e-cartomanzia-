function ensureAuth(req, res, next){
  if (req.session && req.session.userId) return next();
  return res.status(401).json({ok:false, error: 'Not authenticated'});
}

const User = require('../models/User');

async function ensureCredits(req, res, next){
  const user = await User.findById(req.session.userId);
  if (!user) return res.status(401).json({ok:false, error: 'Not authenticated'});
  if (user.credits < 1) return res.status(402).json({ok:false, error: 'Insufficient credits'});
  next();
}

module.exports = { ensureAuth, ensureCredits };
