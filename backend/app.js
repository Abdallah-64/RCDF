import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import api from './routes/api.js';
import { errorHandler, notFound } from './middleware/errors.js';
const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const sensitiveLimiter = (productionLimit, developmentLimit) => rateLimit({
  windowMs: isProduction ? 15 * 60 * 1000 : 60 * 1000,
  limit: isProduction ? productionLimit : developmentLimit,
  standardHeaders: true,
  legacyHeaders: false,
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173', methods: ['GET','POST','PUT','PATCH','DELETE'], allowedHeaders: ['Content-Type','Authorization'] }));
// Allows a carefully limited image data URL from the admin service form.
app.use(express.json({ limit: '2mb' }));
app.use(mongoSanitize());
if (process.env.NODE_ENV !== 'test') app.use(morgan('tiny'));

// Only credential submissions need a strict login throttle. Profile requests
// must remain available so a valid dashboard session is not accidentally locked out.
app.use('/api/auth/login', sensitiveLimiter(10, 100));
app.use('/api/auth/credentials', sensitiveLimiter(5, 30));
app.use('/api/contact', sensitiveLimiter(20, 50));
app.get('/api/health', (req,res) => res.json({ success: true, data: { status: 'ok' } }));
app.use('/api', api);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendBuildDirectory = path.join(currentDirectory, '../frontend/dist');

// Production-style local hosting: Express serves React and the API from one origin.
app.use(express.static(frontendBuildDirectory));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(frontendBuildDirectory, 'index.html'), (error) => {
    if (error) next(error);
  });
});

app.use(notFound);
app.use(errorHandler);
export default app;
