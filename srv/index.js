const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Initialize Prisma
const prisma = require('./lib/prisma');

// Initialize Renovatio sync job
const renovatioSyncJob = require('./jobs/renovatioSync');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/services', require('./routes/services'));
app.use('/api/service-categories', require('./routes/service-categories'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/advantages', require('./routes/advantages'));
app.use('/api/branches', require('./routes/branches'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/services', require('./routes/admin-services'));
app.use('/api/admin/service-categories', require('./routes/admin-service-categories'));
app.use('/api/admin/banners', require('./routes/admin-banners'));
app.use('/api/admin/advantages', require('./routes/admin-advantages'));
app.use('/api/admin/branches', require('./routes/admin-branches'));

// Renovatio integration routes
app.use('/api/renovatio', require('./routes/renovatio'));

// Email verification routes
app.use('/api/verification', require('./routes/verification'));

// Consultation requests
app.use('/api/consultation-requests', require('./routes/consultation-requests'));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  renovatioSyncJob.stop();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  renovatioSyncJob.stop();
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`);
  console.log(`Renovatio API: ${process.env.RENOVATIO_API_KEY ? 'Configured' : 'Not configured'}`);
  
  // Start Renovatio sync job if enabled
  renovatioSyncJob.start();
});
