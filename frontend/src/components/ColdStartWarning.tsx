import { AlertCircle, Loader2 } from 'lucide-react';
import './ColdStartWarning.css';

interface ColdStartWarningProps {
    show: boolean;
}

function ColdStartWarning({ show }: Readonly<ColdStartWarningProps>) {
    if (!show) return null;

    return (
        <div className="cold-start-warning">
            <div className="warning-icon">
                <Loader2 size={20} className="spinning" />
            </div>
            <div className="warning-content">
                <div className="warning-title">
                    <AlertCircle size={18} />
                    <span>Démarrage du serveur en cours</span>
                </div>
                <p>
                    Le serveur était en veille. Premier démarrage en cours (30-50 secondes).
                    Les prochaines requêtes seront instantanées.
                </p>
            </div>
        </div>
    );
}

export default ColdStartWarning;
