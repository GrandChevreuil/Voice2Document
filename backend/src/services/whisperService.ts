import OpenAI from 'openai';
import fs from 'node:fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Transcrit un fichier audio en utilisant l'API Whisper d'OpenAI
 * @param filePath - Chemin vers le fichier audio
 * @returns La transcription du fichier audio
 */
export async function transcribeAudio(filePath: string): Promise<string> {
  try {
    const audioFile = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'fr',
      response_format: 'text',
    });

    console.log('✅ Transcription réussie');
    return transcription;
  } catch (error: any) {
    console.error('Erreur lors de la transcription Whisper:', error);
    throw new Error(`Erreur de transcription: ${error.message}`);
  }
}
