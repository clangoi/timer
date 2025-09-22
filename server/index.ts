import express from 'express';
import { createServer } from 'http';
import { createServer as createViteServer } from 'vite';
import { setupAuth } from './auth';

async function startServer() {
  const app = express();
  const port = 5000;

  // Middleware básico
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configurar autenticación
  setupAuth(app);

  // En desarrollo, usar el servidor de Vite
  if (process.env.NODE_ENV === 'development') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    
    app.use(vite.ssrFixStacktrace);
    app.use(vite.middlewares);
  }

  const server = createServer(app);

  server.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch(console.error);