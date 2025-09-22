import express from 'express';
import path from 'path';
import { createServer } from 'http';

async function startServer() {
  const app = express();
  const port = 5000;

  console.log('Starting simple static server...');

  // Servir archivos estáticos desde dist/public
  const staticPath = path.join(process.cwd(), 'dist/public');
  console.log(`Serving static files from: ${staticPath}`);
  
  app.use(express.static(staticPath));
  
  // SPA fallback - servir index.html para todas las rutas
  app.get('*', (req, res) => {
    console.log(`Request for: ${req.path}`);
    res.sendFile(path.join(staticPath, 'index.html'));
  });

  const server = createServer(app);

  server.listen(port, '0.0.0.0', () => {
    console.log(`Static server running on port ${port}`);
    console.log(`Serving from: ${staticPath}`);
  });
}

startServer();