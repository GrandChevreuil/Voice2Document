import OpenAI from 'openai';
import fs from 'fs';
import { convertToMP3, needsConversion } from './audioConverter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 120000, // 2 minutes (au lieu de 10 minutes par défaut)
  maxRetries: 2, // Réessayer 2 fois en cas d'échec
});

/**
 * Transcrit un fichier audio en utilisant l'API Whisper d'OpenAI
 * @param filePath - Chemin vers le fichier audio
 * @returns La transcription du fichier audio
 */
export async function transcribeAudio(filePath: string): Promise<string> {
  let processedFilePath = filePath;
  
  try {
    console.log(`🎤 Début de la transcription avec Whisper AI...`);
    
    // Vérifier la taille du fichier
    const stats = fs.statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    console.log(`📊 Taille du fichier: ${fileSizeMB.toFixed(2)} MB`);
    
    if (fileSizeMB > 25) {
      throw new Error('Le fichier dépasse la limite de 25MB pour l\'API Whisper');
    }

    // Convertir en MP3 si nécessaire pour assurer la compatibilité
    if (needsConversion(filePath)) {
      console.log(`🔄 Conversion nécessaire pour ${filePath}`);
      processedFilePath = await convertToMP3(filePath);
    }

    const audioFile = fs.createReadStream(processedFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'fr',
      response_format: 'text',
    });

    console.log(`✅ Transcription réussie`);
    
    // NE PAS nettoyer ici, la route s'en charge
    
    return transcription as string;
  } catch (error: any) {
    console.error('❌ Erreur lors de la transcription Whisper:', error);
    
    // NE PAS nettoyer ici, la route s'en charge
    
    // Messages d'erreur plus explicites
    if (error.code === 'ECONNRESET' || error.message?.includes('Connection error')) {
      throw new Error('Timeout de connexion - Le fichier est probablement trop volumineux ou votre connexion internet est instable. Essayez avec un fichier plus court.');
    }
    
    if (error.message?.includes('timeout')) {
      throw new Error('Le traitement a pris trop de temps. Essayez avec un fichier audio plus court.');
    }
    
    if (error.message?.includes('Erreur de conversion')) {
      throw new Error('Format audio incompatible. Essayez avec un fichier WAV ou MP3.');
    }
    
    throw new Error(`Erreur de transcription: ${error.message}`);
  }
}
