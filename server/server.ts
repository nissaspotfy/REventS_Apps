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

// Serve Vite build output in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(process.cwd(), 'dist')));
  
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/api-docs') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
  });
}

// Start Server after DB sync & seeding
const startServer = async () => {
  try {
    await seedDatabase();

    // Chromium Diagnostics
    console.log(`========================================`);
    console.log(`  Chromium Startup Diagnostics`);
    console.log(`  PATH: ${process.env.PATH}`);
    console.log(`  PUPPETEER_EXECUTABLE_PATH: ${process.env.PUPPETEER_EXECUTABLE_PATH}`);
    
    // Test Chromium path lookup
    const { execSync } = await import('child_process');
    const fs = await import('fs');
    const path = await import('path');
    
    let resolvedChromium: string | undefined;
    try {
      const pathEnv = process.env.PATH || '';
      const paths = pathEnv.split(path.delimiter);
      const binNames = ['chromium', 'chromium-browser', 'chrome', 'google-chrome'];
      for (const p of paths) {
        for (const bin of binNames) {
          const fullPath = path.join(p, bin);
          if (fs.existsSync(fullPath)) {
            resolvedChromium = fullPath;
            console.log(`  Diagnostics -> Found candidate in PATH: ${fullPath}`);
          }
        }
      }
    } catch (e) {
      console.log(`  Diagnostics -> Error scanning PATH:`, e);
    }
    
    try {
      const commandPath = execSync('command -v chromium || command -v chromium-browser', { shell: '/bin/sh', stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      console.log(`  Diagnostics -> command -v returned: ${commandPath}`);
    } catch (e) {
      console.log(`  Diagnostics -> command -v failed`);
    }

    const commonPaths = [
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/app/.nix-profile/bin/chromium',
      '/nix/var/nix/profiles/default/bin/chromium',
      '/run/current-system/sw/bin/chromium'
    ];
    for (const p of commonPaths) {
      if (fs.existsSync(p)) {
        console.log(`  Diagnostics -> Common path exists: ${p}`);
      }
    }
    console.log(`========================================`);

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
