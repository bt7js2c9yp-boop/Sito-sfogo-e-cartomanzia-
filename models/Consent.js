const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ConsentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  consent: { type: Schema.Types.Mixed },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consent', ConsentSchema);
