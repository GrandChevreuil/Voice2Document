import { useState, useRef, ChangeEvent } from 'react';
import axios from 'axios';
import { Upload, Music, Check, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import './AudioUploader.css';
import { TranscriptionResult } from '../App';
import ColdStartWarning from './ColdStartWarning';

interface AudioUploaderProps {
  onTranscriptionComplete: (result: TranscriptionResult) => void;
}

function AudioUploader({ onTranscriptionComplete }: Readonly<AudioUploaderProps>) {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ameliorer, setAmeliorer] = useState(true);
  const [isColdStart, setIsColdStart] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Vérifier le type de fichier
      const allowedTypes = ['audio/wav', 'audio/mpeg', 'audio/mp3', 'audio/m4a', 'audio/ogg', 'audio/webm'];
      const fileExtensionPattern = /\.(wav|mp3|m4a|ogg|webm)$/i;
      if (!allowedTypes.includes(selectedFile.type) && !fileExtensionPattern.exec(selectedFile.name)) {
        setError('Format de fichier non supporté. Utilisez WAV, MP3, M4A, OGG ou WEBM.');
        return;
      }

      // Vérifier la taille (max 25MB)
      if (selectedFile.size > 25 * 1024 * 1024) {
        setError('Le fichier est trop volumineux. Taille maximale: 25MB');
        return;
      }

      setFile(selectedFile);
      setError(null);
    }
  };

  const handleTranscribe = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier audio');
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress(0);

    const coldStartTimer = setTimeout(() => {
      setIsColdStart(true);
    }, 3000);

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('ameliorer', ameliorer.toString()); // Envoyer l'option d'amélioration

    try {
      const response = await axios.post<{
        transcriptionBrute: string;
        texteAmeliore?: string;
        filename: string;
      }>(
        '/api/transcription/transcribe',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          },
        }
      );

      clearTimeout(coldStartTimer);
      setIsColdStart(false);

      onTranscriptionComplete({
        transcription: response.data.texteAmeliore || response.data.transcriptionBrute,
        transcriptionBrute: response.data.transcriptionBrute,
        texteAmeliore: response.data.texteAmeliore,
        filename: response.data.filename,
      });

      // Réinitialiser le formulaire
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      clearTimeout(coldStartTimer);
      setIsColdStart(false);
      setError(
        err.response?.data?.error || err.response?.data?.details || 'Erreur lors de la transcription'
      );
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      // Créer un événement simulé pour réutiliser la validation
      const fakeEvent = {
        target: { files: [droppedFile] },
      } as unknown as ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  // Extraire le ternaire imbriqué pour une meilleure lisibilité
  const getProgressText = () => {
    if (progress < 100) {
      return `Envoi: ${progress}%`;
    }
    return ameliorer ? 'Transcription et amélioration en cours' : 'Transcription en cours';
  };

  return (
    <div className="uploader-container">
      <ColdStartWarning show={isColdStart} />
      <button
        type="button"
        className={`drop-zone ${file ? 'has-file' : ''}`}
        aria-label="Zone de dépôt de fichier audio"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".wav,.mp3,.m4a,.ogg,.webm,audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {file ? (
          <div className="file-info">
            <div className="file-icon">
              <Music size={32} />
            </div>
            <div className="file-details">
              <p className="file-name">{file.name}</p>
              <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
            <div className="file-check">
              <Check size={20} />
            </div>
          </div>
        ) : (
          <div className="drop-zone-content">
            <Upload size={48} className="upload-icon" />
            <p className="drop-text">
              Glissez-déposez un fichier audio ou cliquez pour sélectionner
            </p>
            <p className="formats-text">WAV, MP3, M4A, OGG, WEBM (max 25MB)</p>
          </div>
        )}
      </button>

      {error && (
        <div className="error-message">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {isLoading && (
        <div className="progress-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="progress-text">
            <Loader2 size={16} className="spinner" />
            {getProgressText()}
          </p>
        </div>
      )}

      <div className="options-container">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={ameliorer}
            onChange={(e) => setAmeliorer(e.target.checked)}
            disabled={isLoading}
          />
          <div className="checkbox-content">
            <span>
              <Sparkles size={16} className="inline-icon" />
              Améliorer avec ChatGPT (GPT-4o-mini)
            </span>
            <small>Correction et restructuration du texte</small>
          </div>
        </label>
      </div>

      <button
        className={`transcribe-button ${isLoading ? 'loading' : ''}`}
        onClick={handleTranscribe}
        disabled={!file || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} className="spinner" />
            Traitement en cours...
          </>
        ) : (
          'Transcrire'
        )}
      </button>
    </div>
  );
}

export default AudioUploader;
