import express from 'express';

// Importez et configurez Bull Board
// import { createBullBoard } from 'bull-board';
// import { BullAdapter } from 'bull-board/bullAdapter';
import router from './routes';
// import fileQueue from './worker';

// const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 5000;

// Augmenter la limite de taille des fichiers d'upload
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());

app.use('/', router); // Importez votre queue

// const { router: bullBoardRouter } = createBullBoard([
//   new BullAdapter(fileQueue),
// ]);
// app.use('/admin/queues', bullBoardRouter);

// Lancement du serveur
app.listen(port, () => {
  console.log('Server running on port', port);
});
