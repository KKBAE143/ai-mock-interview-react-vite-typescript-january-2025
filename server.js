import { createServer } from 'vite';

async function startServer() {
  const server = await createServer({
    // Load vite.config.js
    configFile: './vite.config.ts',
    server: {
      port: 5174,
      strictPort: false,
      middlewareMode: false
    }
  });

  await server.listen();

  server.printUrls();
}

startServer().catch((err) => {
  console.error('Error starting server:', err);
  process.exit(1);
}); 