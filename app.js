const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// DB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// Stripe webhook route uses raw body; ensure the general JSON parser runs before it for other routes

// Sessions
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Routes
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const paymentRoutes = require('./routes/payment');
const gdprRoutes = require('./routes/gdpr');

app.use('/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/gdpr', gdprRoutes);

// Stripe webhook needs raw body; create a dedicated endpoint
const paymentController = require('./controllers/paymentController');
app.post('/webhook', bodyParser.raw({type: 'application/json'}), paymentController.handleWebhook);

app.get('/health', (req, res) => res.send({ok: true}));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
