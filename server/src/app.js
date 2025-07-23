import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import userRoutes from './routes/user.routes.js';
import intensityRoutes from './routes/intensity.routes.js';
import nutritionRoutes from './routes/nutrition.routes.js';
import weightRoutes from './routes/weight.routes.js';

const app = express();

// ['Content-Type', 'Authorization']

const corsOptions = {
    origin: ['http://localhost:4200', 'http://example.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use('/api', userRoutes);
app.use('/api', intensityRoutes);
app.use('/api', nutritionRoutes);
app.use('/api', weightRoutes);

export default app;
