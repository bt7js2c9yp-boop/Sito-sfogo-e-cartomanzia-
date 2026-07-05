const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcrypt');

async function register(email, password) {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('Email already registered');
  const passwordHash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash });
  await user.save();
  return user;
}

async function authenticate(email, password) {
  const user = await User.findOne({ email });
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

async function addCredits(userId, credits, meta = {}) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  user.credits += credits;
  await user.save();
  const tx = new Transaction({ user: user._id, type: 'purchase', amount: credits, meta });
  await tx.save();
  return user;
}

async function chargeForChat(userId, cost = 1, meta = {}) {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  if (user.credits < cost) throw new Error('Insufficient credits');
  user.credits -= cost;
  await user.save();
  const tx = new Transaction({ user: user._id, type: 'chat', amount: -cost, meta });
  await tx.save();
  return user;
}

module.exports = { register, authenticate, addCredits, chargeForChat };
