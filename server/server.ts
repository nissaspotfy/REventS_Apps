import 'dotenv/config';
import express from 'express';
import path from 'path';
import apiRoutes from './routes';
import swaggerRoutes from './routes/swagger';
import passport from './config/passport';

import { seedDatabase } from './services/db.service';


const app = express();
const PORT = process.env.PORT || 5000;

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Initialize Passport (no session needed — JWT only)
app.use(passport.initialize());

// Custom CORS Middleware (Zero-Dependency)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Swagger documentation served at /api-docs (or /api/docs)
app.use('/api-docs', swaggerRoutes);

// Register API Routes
app.use('/api', apiRoutes);

// Simple Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Start Server after DB sync & seeding
const startServer = async () => {
  try {
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`========================================`);
      console.log(`  REventS Backend Server is running!`);
      console.log(`  Port: ${PORT}`);
      console.log(`  Health check: http://localhost:${PORT}/health`);
      console.log(`  Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`========================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
