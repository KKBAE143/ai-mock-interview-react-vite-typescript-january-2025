const express = require('express');
const { createServer: createViteServer } = require('vite');
const compression = require('compression');

async function createServer() {
  const app = express();
  
  // Enable gzip compression
  app.use(compression());
  
  // Increase header limits
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // CORS configuration
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
  });

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  const port = process.env.PORT || 5174;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

createServer(); 