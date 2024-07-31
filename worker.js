import Queue from 'bull';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import imageThumbnail from 'image-thumbnail';
import dbClient from './utils/db';

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job, done) => {
  const { userId, fileId } = job.data;
  console.log('Processing job:', job.data);

  if (!userId) {
    console.error('Missing userId');
    return done(new Error('Missing userId'));
  }

  if (!fileId) {
    console.error('Missing fileId');
    return done(new Error('Missing fileId'));
  }

  try {
    const file = await dbClient.db.collection('files').findOne({ userId: new ObjectId(userId), _id: new ObjectId(fileId) });

    if (!file) {
      console.error('File not found');
      return done(new Error('File not found'));
    }

    if (file.type !== 'image') {
      console.error('File is not an image');
      return done(new Error('File is not an image'));
    }

    const filePath = file.localPath;
    if (!fs.existsSync(filePath)) {
      console.error('File path does not exist:', filePath);
      return done(new Error('File not found'));
    }

    const sizes = [500, 250, 100];
    for (const size of sizes) {
      const options = { width: size };
      try {
        const thumbnail = await imageThumbnail(filePath, options);
        const thumbnailPath = `${filePath}_${size}`;

        fs.writeFileSync(thumbnailPath, thumbnail);
        console.log(`Thumbnail created at ${thumbnailPath}`);
      } catch (err) {
        console.error(`Error creating thumbnail for size ${size}:`, err.message);
        return done(new Error(`Error creating thumbnail for size ${size}: ${err.message}`));
      }
    }

    done();
  } catch (err) {
    console.error('Error processing job:', err);
    done(new Error(`Error processing job: ${err.message}`));
  }
});

export default fileQueue;
