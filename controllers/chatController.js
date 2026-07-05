const userService = require('../services/userService');

// For demonstration chat history is stored in memory (could be a DB collection)
const historyStore = [];

async function sendMessage(req, res){
  try{
    const userId = req.session.userId;
    const { message } = req.body;
    // charge
    await userService.chargeForChat(userId, 1, { message });
    // store message
    const msg = { user: userId, message, createdAt: new Date() };
    historyStore.push(msg);
    res.json({ok:true, reply: `Grazie per lo sfogo: "${message}"`});
  }catch(err){
    res.status(400).json({ok:false, error: err.message});
  }
}

async function history(req, res){
  res.json({ok:true, history: historyStore});
}

module.exports = { sendMessage, history };
