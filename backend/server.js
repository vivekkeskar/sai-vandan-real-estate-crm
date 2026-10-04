const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seed');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database & Seed initial data
connectDB().then(async () => {
  // Auto-seed demo data if DB is fresh
  const User = require('./models/User');
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('Database empty. Running initial master seed...');
    await seedData();
  }
});

// Manual Re-seed Endpoint
app.post('/api/seed', async (req, res) => {
  try {
    await seedData();
    res.json({ message: 'Database successfully re-seeded with Sai Vandan demo data!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/leads', require('./routes/leadRoutes'));
app.use('/api', require('./routes/crmRoutes'));
app.use('/api', require('./routes/hrRoutes'));
app.use('/api', require('./routes/financeRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/reports', require('./routes/reportsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', project: 'SAI VANDAN COMPLEX CRM', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Sai Vandan CRM Server running on port ${PORT}`);
});
