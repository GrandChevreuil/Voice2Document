import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import transcriptionRouter from './routes/transcription';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/api/transcription', transcriptionRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
