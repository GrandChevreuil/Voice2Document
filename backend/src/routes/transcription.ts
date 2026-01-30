import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { transcribeAudio } from '../services/whisperService';
import { generateWordDocument } from '../services/documentService';
import { improveTranscription } from '../services/chatgptService';

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // Limite de 25MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /wav|mp3|m4a|ogg|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers audio (WAV, MP3, M4A, OGG, WEBM) sont acceptés'));
    }
  },
});

// Route pour transcrire l'audio
router.post('/transcribe', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier audio fourni' });
    }

    const ameliorer = req.body.ameliorer === 'true';

    const transcription = await transcribeAudio(req.file.path);

    let result: any = {
      success: true,
      transcriptionBrute: transcription,
      filename: req.file.originalname,
    };

    if (ameliorer) {
      const texteAmeliore = await improveTranscription(transcription);
      result.texteAmeliore = texteAmeliore;
    }

    // Supprimer le fichier original ET le fichier converti s'il existe
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    // Supprimer aussi le MP3 converti si différent
    const mp3Path = req.file.path.replace(path.extname(req.file.path), '.mp3');
    if (mp3Path !== req.file.path && fs.existsSync(mp3Path)) {
      fs.unlinkSync(mp3Path);
    }

    res.json(result);
  } catch (error: any) {
    console.error('Erreur lors de la transcription:', error);

    // Nettoyer les fichiers en cas d'erreur
    if (req.file) {
      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      // Supprimer aussi le MP3 converti si différent
      const mp3Path = req.file.path.replace(path.extname(req.file.path), '.mp3');
      if (mp3Path !== req.file.path && fs.existsSync(mp3Path)) {
        fs.unlinkSync(mp3Path);
      }
    }

    res.status(500).json({
      error: 'Erreur lors de la transcription',
      details: error.message,
    });
  }
});

// Route pour générer un document Word
router.post('/generate-document', async (req: Request, res: Response) => {
  try {
    const { transcription, title } = req.body;

    if (!transcription) {
      return res.status(400).json({ error: 'Aucune transcription fournie' });
    }

    const buffer = await generateWordDocument(transcription, title || 'Transcription Audio');

    const safeFilename = encodeURIComponent(title || 'transcription');

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFilename}.docx`);
    res.setHeader('Content-Length', buffer.length.toString());

    res.end(buffer, 'binary');
  } catch (error: any) {
    console.error('Erreur lors de la génération du document:', error);
    res.status(500).json({
      error: 'Erreur lors de la génération du document',
      details: error.message,
    });
  }
});

// Route combinée: transcrire et générer le document directement
router.post('/transcribe-and-generate', upload.single('audio'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier audio fourni' });
    }

    const title = req.body.title || path.parse(req.file.originalname).name;
    const ameliorer = req.body.ameliorer === 'true';

    const transcription = await transcribeAudio(req.file.path);

    let texteAUtiliser = transcription;
    if (ameliorer) {
      texteAUtiliser = await improveTranscription(transcription);
    }

    const buffer = await generateWordDocument(texteAUtiliser, title);

    fs.unlinkSync(req.file.path);

    const safeFilename = encodeURIComponent(title);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFilename}.docx`);
    res.setHeader('Content-Length', buffer.length.toString());

    res.end(buffer, 'binary');
  } catch (error: any) {
    console.error('Erreur lors du traitement:', error);

    // Nettoyer le fichier en cas d'erreur
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      error: 'Erreur lors du traitement',
      details: error.message,
    });
  }
});

export default router;
