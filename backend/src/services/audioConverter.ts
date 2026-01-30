import ffmpeg from 'fluent-ffmpeg';
import ffmpegPath from '@ffmpeg-installer/ffmpeg';
import path from 'node:path';

// Configurer ffmpeg pour utiliser le binaire installé
ffmpeg.setFfmpegPath(ffmpegPath.path);

/**
 * Convertit un fichier audio en MP3 pour assurer la compatibilité avec Whisper
 * @param inputPath - Chemin du fichier audio d'entrée
 * @returns Chemin du fichier MP3 converti
 */
export async function convertToMP3(inputPath: string): Promise<string> {
  const outputPath = inputPath.replace(path.extname(inputPath), '.mp3');

  return new Promise((resolve, reject) => {
    console.log(`🔄 Conversion en MP3: ${path.basename(inputPath)}`);

    ffmpeg(inputPath)
      .toFormat('mp3')
      .audioCodec('libmp3lame')
      .audioBitrate('128k') // Qualité suffisante pour la transcription
      .on('start', (commandLine) => {
        console.log(`Commande ffmpeg: ${commandLine}`);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`⏳ Progression: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('✅ Conversion MP3 terminée');
        
        // NE PAS supprimer le fichier original ici
        // Il sera supprimé par la route après utilisation
        
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Erreur de conversion:', err);
        reject(new Error(`Erreur de conversion audio: ${err.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Vérifie si un fichier audio nécessite une conversion
 * @param filePath - Chemin du fichier
 * @returns true si conversion nécessaire
 */
export function needsConversion(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  // Convertir les M4A car ils peuvent avoir des codecs incompatibles
  // Les autres formats (WAV, OGG, WEBM) aussi pour uniformiser
  return ext === '.m4a' || ext === '.ogg' || ext === '.webm';
}
