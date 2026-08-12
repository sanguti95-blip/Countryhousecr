import express from 'express';
import cors from 'cors';
import productsRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', service: 'Verdant Harvest API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/v1/products', productsRoutes);
app.use('/api/v1/orders', ordersRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: { code: 'SERVER_ERROR', message: 'Error interno del servidor.' } });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Verdant Harvest REST API Server active on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/v1/health`);
});
