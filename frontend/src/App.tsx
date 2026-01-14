import { useState } from 'react';
import './App.css';
import AudioUploader from './components/AudioUploader';
import TranscriptionDisplay from './components/TranscriptionDisplay';

export interface TranscriptionResult {
  transcription: string;
  transcriptionBrute?: string;
  texteAmeliore?: string;
  filename: string;
}

function App() {
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>Voice2Document</h1>
          <p>Transcription audio vers document Word</p>
        </header>

        <AudioUploader onTranscriptionComplete={setTranscription} />

        {transcription && (
          <TranscriptionDisplay result={transcription} />
        )}
      </div>
    </div>
  );
}

export default App;
