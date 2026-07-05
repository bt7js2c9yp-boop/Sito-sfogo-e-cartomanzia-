const userService = require('../services/userService');

async function register(req, res){
  try {
    const { email, password } = req.body;
    const user = await userService.register(email, password);
    req.session.userId = user._id;
    res.json({ok: true});
  } catch(err){
    res.status(400).json({ok:false, error: err.message});
  }
}

async function login(req, res){
  try{
    const { email, password } = req.body;
    const user = await userService.authenticate(email, password);
    if (!user) return res.status(401).json({ok:false, error: 'Invalid credentials'});
    req.session.userId = user._id;
    res.json({ok:true});
  } catch(err){
    res.status(400).json({ok:false, error: err.message});
  }
}

function logout(req, res){
  req.session.destroy(() => res.json({ok:true}));
}

module.exports = { register, login, logout };
