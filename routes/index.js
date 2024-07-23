import express from 'express';
import AppController from '../controllers/AppController';

const app = express.Router();

app.get('/status', AppController.getStatus);

app.get('/stats', AppController.getStats);

export default app;
