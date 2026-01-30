import { Github, Linkedin, Info } from 'lucide-react';
import './Footer.css';

interface FooterProps {
    onPrivacyClick: () => void;
}

function Footer({ onPrivacyClick }: Readonly<FooterProps>) {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-links">
                    <a
                        href="https://github.com/GrandChevreuil/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        <Github size={18} />
                        GitHub
                    </a>
                    <a
                        href="https://www.linkedin.com/in/mathis-mauprivez/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                    >
                        <Linkedin size={18} />
                        LinkedIn
                    </a>
                    <button
                        className="footer-link privacy-link"
                        onClick={onPrivacyClick}
                    >
                        <Info size={18} />
                        Confidentialité
                    </button>
                </div>
                <p className="footer-copyright">
                    © {currentYear} GrandChevreuil. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
