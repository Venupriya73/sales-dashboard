const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const transactionRoutes = require('./routes/transactions');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://sales-dashboard-ruddy-five.vercel.app'
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
app.use(express.json());

app.use('/api/transactions', transactionRoutes);
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});