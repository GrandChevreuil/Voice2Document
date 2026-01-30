import { useState } from 'react';
import './App.css';
import AudioUploader from './components/AudioUploader';
import TranscriptionDisplay from './components/TranscriptionDisplay';
import PrivacyModal from './components/PrivacyModal';
import Footer from './components/Footer';

export interface TranscriptionResult {
  transcription: string;
  transcriptionBrute?: string;
  texteAmeliore?: string;
  filename: string;
}

function App() {
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

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

        <PrivacyModal
          isOpen={isPrivacyModalOpen}
          onClose={() => setIsPrivacyModalOpen(false)}
        />
      </div>

      <Footer onPrivacyClick={() => setIsPrivacyModalOpen(true)} />
    </div>
  );
}

export default App;
