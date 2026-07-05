const Consent = require('../models/Consent');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

async function saveConsent(req, res){
  try{
    const userId = req.session.userId;
    const { consent } = req.body;
    if (!userId) return res.status(401).json({ok:false, error:'Not authenticated'});
    await Consent.findOneAndUpdate({ user: userId }, { user: userId, consent, updatedAt: new Date() }, { upsert: true });
    return res.json({ok:true});
  }catch(err){
    console.error(err);
    return res.status(500).json({ok:false, error: err.message});
  }
}

async function exportData(req, res){
  try{
    const userId = req.session.userId;
    const user = await User.findById(userId).select('-passwordHash');
    const transactions = await Transaction.find({ user: userId }).sort({ createdAt: -1 });
    const consents = await Consent.find({ user: userId }).sort({ updatedAt: -1 });
    return res.json({ ok: true, data: { user, transactions, consents } });
  }catch(err){
    console.error(err);
    return res.status(500).json({ok:false, error: err.message});
  }
}

async function deleteAccount(req, res){
  try{
    const userId = req.session.userId;
    // delete related data
    await Transaction.deleteMany({ user: userId });
    await Consent.deleteMany({ user: userId });
    // note: chat history stored in memory currently and cannot be fully deleted here
    await User.findByIdAndDelete(userId);
    req.session.destroy(() => {});
    return res.json({ ok: true });
  }catch(err){
    console.error(err);
    return res.status(500).json({ok:false, error: err.message});
  }
}

module.exports = { saveConsent, exportData, deleteAccount };
