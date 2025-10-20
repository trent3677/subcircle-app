import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { db } from './db';
import apiRoutes from './routes/api';
import { setupAuth } from './replitAuth';

const app = express();
const PORT = Number(process.env.PORT) || 8080;

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(morgan('combined') as any);
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the public directory
app.use(express.static(path.join(process.cwd(), 'public')));

async function setupServer() {
  // Setup Replit Auth middleware
  await setupAuth(app);
  
  // API routes
  app.use('/api', apiRoutes);

  // Serve static files from dist directory (build output)
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  console.log('✅ Serving static files from:', distPath);
  
  // Add a basic GET handler for /api to respond to health checks
  app.get('/api', (req, res) => {
    res.json({ 
      status: 'ok', 
      message: 'API is running',
      endpoints: ['/api/push/*', '/api/notifications/*'],
      timestamp: new Date().toISOString()
    });
  });

  // Catch-all handler for SPA routes - ONLY serve index.html for GET requests to HTML pages
  // This must come AFTER express.static so static files are served first
  app.use((req, res, next) => {
    // Only handle GET requests (not POST, PUT, DELETE, etc.)
    if (req.method !== 'GET') {
      return next();
    }
    
    // express.static will have already handled actual files before this runs
    // This only runs for GET requests that didn't match any file or API route
    const indexPath = path.join(distPath, 'index.html');
    res.sendFile(indexPath);
  });

  // Start the server AFTER all middleware is set up
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://0.0.0.0:${PORT}/health`);
    console.log(`🛠️  API routes: http://0.0.0.0:${PORT}/api`);
  });
}

// Start the server
setupServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});

export default app;