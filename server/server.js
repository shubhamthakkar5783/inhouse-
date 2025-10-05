const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./database');

const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Event Planner API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      events: '/api/events',
      budgets: '/api/budgets',
      tasks: '/api/tasks'
    }
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  try {
    console.log('\n========================================');
    console.log('  Smart Event Planner Backend Server  ');
    console.log('========================================\n');

    console.log('Initializing database...');
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log('========================================');
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at: http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
      console.log('========================================\n');
      console.log('Available endpoints:');
      console.log(`  → Users:   http://localhost:${PORT}/api/users`);
      console.log(`  → Events:  http://localhost:${PORT}/api/events`);
      console.log(`  → Budgets: http://localhost:${PORT}/api/budgets`);
      console.log(`  → Tasks:   http://localhost:${PORT}/api/tasks`);
      console.log('\n========================================\n');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
