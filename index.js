import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';

//components
import Connection from './database/db.js';
import Router from './routes/route.js';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
    contentSecurityPolicy: false, 
}));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Serve React static files
app.use(express.static(path.join(__dirname, './client/build')));

// API routes
app.use('/', Router);

// Catch-all: serve React index.html for any non-API route (React Router support)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});


const PORT = process.env.PORT || 8000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

Connection(username, password);

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));