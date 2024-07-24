import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const app = express.Router();

app.get('/status', AppController.getStatus);

app.get('/stats', AppController.getStats);

app.post('/users', UsersController.postNew);

export default app;
