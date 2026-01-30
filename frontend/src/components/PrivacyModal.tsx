import { X, Shield, Lock, Trash2, FileAudio, FileText, Server } from 'lucide-react';
import './PrivacyModal.css';

interface PrivacyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

function PrivacyModal({ isOpen, onClose }: Readonly<PrivacyModalProps>) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Fermer">
                    <X size={20} />
                </button>

                <div className="modal-header">
                    <Shield size={32} />
                    <h2>Confidentialité et Utilisation des Données</h2>
                </div>

                <div className="modal-body">
                    <section className="info-section">
                        <div className="section-icon">
                            <FileAudio size={24} />
                        </div>
                        <div className="section-content">
                            <h3>Vos fichiers audio</h3>
                            <p>
                                Les fichiers audio que vous uploadez sont <strong>temporairement stockés</strong> sur notre serveur
                                uniquement le temps du traitement. Une fois la transcription terminée, le fichier est
                                <strong> immédiatement supprimé</strong>.
                            </p>
                        </div>
                    </section>

                    <section className="info-section">
                        <div className="section-icon">
                            <Server size={24} />
                        </div>
                        <div className="section-content">
                            <h3>Traitement de la transcription</h3>
                            <p>
                                Votre fichier audio est envoyé à <strong>l'API Whisper d'OpenAI</strong> pour la transcription.
                                OpenAI traite le fichier selon leur politique de confidentialité et ne conserve pas vos données
                                au-delà du traitement immédiat.
                            </p>
                        </div>
                    </section>

                    <section className="info-section">
                        <div className="section-icon">
                            <FileText size={24} />
                        </div>
                        <div className="section-content">
                            <h3>Amélioration du texte</h3>
                            <p>
                                Si vous activez l'option d'amélioration, le texte transcrit est envoyé à <strong>ChatGPT (GPT-4o-mini)</strong>
                                {' '}pour correction et restructuration. Aucun texte n'est stocké après le traitement.
                            </p>
                        </div>
                    </section>

                    <section className="info-section">
                        <div className="section-icon">
                            <Trash2 size={24} />
                        </div>
                        <div className="section-content">
                            <h3>Suppression des données</h3>
                            <p>
                                <strong>Aucune donnée n'est conservée</strong> après la génération de votre document Word.
                                Ni le fichier audio, ni la transcription ne sont stockés sur nos serveurs.
                                Tout est supprimé immédiatement après le téléchargement.
                            </p>
                        </div>
                    </section>

                    <section className="info-section">
                        <div className="section-icon">
                            <Lock size={24} />
                        </div>
                        <div className="section-content">
                            <h3>Sécurité</h3>
                            <p>
                                Toutes les communications entre votre navigateur et nos serveurs sont <strong>chiffrées via HTTPS</strong>.
                                Vos fichiers ne sont jamais accessibles à des tiers et ne sont jamais utilisés pour
                                entraîner des modèles d'intelligence artificielle.
                            </p>
                        </div>
                    </section>

                    <div className="info-footer">
                        <p>
                            <strong>En résumé :</strong> Vos données sont traitées de manière temporaire et sécurisée,
                            puis immédiatement supprimées. Nous ne conservons aucune information personnelle.
                        </p>
                    </div>

                    <button className="modal-close-mobile" onClick={onClose}>
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PrivacyModal;
