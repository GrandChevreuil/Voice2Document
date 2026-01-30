import { useState } from 'react';
import axios from 'axios';
import { Copy, Download, Loader2, BarChart, Sparkles, FileText, Check } from 'lucide-react';
import './TranscriptionDisplay.css';
import { TranscriptionResult } from '../App';

interface TranscriptionDisplayProps {
  result: TranscriptionResult;
}

function TranscriptionDisplay({ result }: Readonly<TranscriptionDisplayProps>) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [afficherBrut, setAfficherBrut] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

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
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
          <button className={`copy-button ${isCopied ? 'copied' : ''}`} onClick={handleCopyText}>
            {isCopied ? (
              <>
                <Check size={16} />
                Copié !
              </>
            ) : (
              <>
                <Copy size={16} />
                Copier
              </>
            )}
          </button>
          <button
            className={`download-button ${isGenerating ? 'loading' : ''}`}
            onClick={handleDownloadWord}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="spinner" />
                Génération...
              </>
            ) : (
              <>
                <Download size={16} />
                Télécharger .docx (Word)
              </>
            )}
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
            <Sparkles size={16} />
            Texte amélioré
          </button>
          <button
            className={`toggle-button ${afficherBrut ? 'active' : ''}`}
            onClick={() => setAfficherBrut(true)}
          >
            <FileText size={16} />
            Texte brut
          </button>
        </div>
      )}

      <div className="transcription-content">
        <p className="source-file">Source: {result.filename}</p>
        <div className="transcription-text">{texteAAfficher}</div>
      </div>

      <div className="stats">
        <span>
          <BarChart size={14} className="stat-icon" />
          {texteAAfficher.split(/\s+/).length} mots
        </span>
        <span>
          <BarChart size={14} className="stat-icon" />
          {texteAAfficher.length} caractères
        </span>
      </div>
    </div>
  );
}

export default TranscriptionDisplay;
