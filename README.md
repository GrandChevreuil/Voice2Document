# Voice2Document

A production-ready application for transcribing audio files to text and generating professional Word documents.

## Technology Stack

### Backend
- Node.js with TypeScript
- Express.js web framework
- OpenAI Whisper API for audio transcription
- ChatGPT (GPT-4o-mini) for text enhancement
- docx library for Word document generation
- Multer for file upload handling

### Frontend
- React with TypeScript
- Vite build tool
- Axios HTTP client

## Prerequisites

- Node.js version 18.x or higher
- npm or yarn package manager
- OpenAI API key with access to Whisper and GPT models

## OpenAI API Key Setup

1. Create an account at [platform.openai.com](https://platform.openai.com/)
2. Navigate to the API Keys section
3. Generate a new secret key
4. Store the key securely (it will only be displayed once)

**Pricing Information:**
- Whisper API: Approximately $0.006 per minute of audio
- Example cost: 1 hour of audio transcription costs approximately $0.36
- GPT-4o-mini: Token-based pricing for text enhancement

## Installation

### Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

Create environment configuration:

```bash
cp .env.example .env
```

Configure the `.env` file with your credentials:

```env
OPENAI_API_KEY=your-api-key-here
PORT=3001
```

### Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd frontend
npm install
```

## Running the Application

### Development Mode (Recommended)

Start the backend server in a terminal:

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:3001`

Start the frontend application in a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend application will run on `http://localhost:3000`

### Production Build

Build the backend:

```bash
cd backend
npm run build
npm start
```

Build the frontend:

```bash
cd frontend
npm run build
npm run preview
```

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Upload an audio file using drag-and-drop or file selection
3. Choose whether to enhance the transcription with ChatGPT
4. Click the transcribe button to process the audio
5. View the transcription results
6. Toggle between raw and enhanced text (if enhancement was enabled)
7. Download the transcription as a Word document

## Project Structure

```
Voice2Document/
├── backend/
│   ├── src/
│   │   ├── server.ts
│   │   ├── routes/
│   │   │   └── transcription.ts
│   │   └── services/
│   │       ├── whisperService.ts
│   │       ├── chatgptService.ts
│   │       └── documentService.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── App.tsx
    │   ├── components/
    │   │   ├── AudioUploader.tsx
    │   │   └── TranscriptionDisplay.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

## API Reference

### Transcribe Audio

**Endpoint:** `POST /api/transcription/transcribe`

Transcribes an audio file to text with optional ChatGPT enhancement.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `audio`: Audio file (required)
  - `ameliorer`: Boolean string ("true" or "false") for enhancement

**Response:**
```json
{
  "success": true,
  "transcriptionBrute": "Raw transcription text...",
  "texteAmeliore": "Enhanced text (if requested)...",
  "filename": "audio.mp3"
}
```

### Generate Word Document

**Endpoint:** `POST /api/transcription/generate-document`

Generates a formatted Word document from transcription text.

**Request:**
```json
{
  "transcription": "Text to convert to Word",
  "title": "Document title"
}
```

**Response:** Binary file download (.docx)

### Transcribe and Generate

**Endpoint:** `POST /api/transcription/transcribe-and-generate`

Combined endpoint that transcribes audio and generates a Word document in one request.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - `audio`: Audio file (required)
  - `title`: Document title (optional)
  - `ameliorer`: Boolean string for enhancement

**Response:** Binary file download (.docx)

## Supported Audio Formats

- WAV (Waveform Audio File Format)
- MP3 (MPEG Audio Layer 3)
- M4A (MPEG-4 Audio)
- OGG (Ogg Vorbis)
- WEBM (WebM Audio)

**Maximum file size:** 25 MB

## Troubleshooting

### API Key Issues

**Error: "OPENAI_API_KEY not found"**
- Verify that the `.env` file exists in the backend directory
- Confirm the API key is properly configured in the `.env` file
- Restart the backend server after making changes

### Connection Issues

**Error: "Cannot connect to server"**
- Verify the backend is running on port 3001
- Check backend console logs for errors
- Ensure no firewall is blocking the connection

### Upload Issues

**Error during file upload**
- Verify the file format is supported
- Confirm file size is under 25 MB
- Check network connectivity

### Performance Considerations

**Transcription processing time**
- Whisper typically processes audio at a 6:1 ratio (1 minute of audio takes ~10 seconds)
- ChatGPT enhancement adds 5-15 seconds depending on text length
- Larger files will take proportionally longer to process

## Future Enhancements

- Automatic language detection for multilingual support
- Real-time transcription preview
- Transcription history and management
- Chunked upload for larger files (>25 MB)
- PDF export option
- Batch processing for multiple files
- Custom formatting templates for Word documents
- Integration with cloud storage providers

## License

MIT License

## Technical Support

For technical documentation and support:
- OpenAI Whisper Documentation: [platform.openai.com/docs/guides/speech-to-text](https://platform.openai.com/docs/guides/speech-to-text)
- OpenAI API Reference: [platform.openai.com/docs/api-reference](https://platform.openai.com/docs/api-reference)

## Contributing

Contributions are welcome. Please open an issue to discuss proposed changes before submitting a pull request.

---

Built with TypeScript and modern web technologies.
