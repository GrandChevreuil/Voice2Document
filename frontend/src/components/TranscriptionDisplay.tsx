import { useState } from 'react';
import axios from 'axios';
import './TranscriptionDisplay.css';
import { TranscriptionResult } from '../App';

interface TranscriptionDisplayProps {
  result: TranscriptionResult;
}

function TranscriptionDisplay({ result }: Readonly<TranscriptionDisplayProps>) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [afficherBrut, setAfficherBrut] = useState(false);

  const handleDownloadWord = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const title = result.filename.replace(/\.[^/.]+$/, ''); // Enlever l'extension

      const response = await axios.post(
        '/api/transcription/generate-document',
        {
          transcription: result.transcription,
          title,
        },
        {
          responseType: 'blob',
        }
      );

      // Créer un lien de téléchargement
      const url = globalThis.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${title}.docx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      globalThis.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError('Erreur lors de la génération du document Word');
      console.error('Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = () => {
    const texteToCopy = afficherBrut ? result.transcriptionBrute! : result.transcription;
    navigator.clipboard.writeText(texteToCopy);
  };

  const texteAAfficher = afficherBrut && result.transcriptionBrute
    ? result.transcriptionBrute
    : result.transcription;

  const aEteAmeliore = !!result.texteAmeliore;

  return (
    <div className="transcription-container">
      <div className="transcription-header">
        <h2>Transcription</h2>
        <div className="action-buttons">
          <button className="copy-button" onClick={handleCopyText}>
            Copier
          </button>
          <button
            className={`download-button ${isGenerating ? 'loading' : ''}`}
            onClick={handleDownloadWord}
            disabled={isGenerating}
          >
            {isGenerating ? 'Génération...' : 'Télécharger Word'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {aEteAmeliore && (
        <div className="toggle-container">
          <button
            className={`toggle-button ${afficherBrut ? '' : 'active'}`}
            onClick={() => setAfficherBrut(false)}
          >
            Texte amélioré
          </button>
          <button
            className={`toggle-button ${afficherBrut ? 'active' : ''}`}
            onClick={() => setAfficherBrut(true)}
          >
            Texte brut
          </button>
        </div>
      )}

      <div className="transcription-content">
        <p className="source-file">Source: {result.filename}</p>
        <div className="transcription-text">{texteAAfficher}</div>
      </div>

      <div className="stats">
        <span>{texteAAfficher.split(/\s+/).length} mots</span>
        <span>{texteAAfficher.length} caractères</span>
      </div>
    </div>
  );
}

export default TranscriptionDisplay;
