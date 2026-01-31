import type { ZoneVide, FormatReponse } from './types';
import { chargerEtParserDocx, extraireSDTExistants } from './xml/chargeur';
import { extraireZonesVides } from './detection/sections';
import { creerFormatReponse, creerPromptSysteme } from './chatgpt/format';

/**
 * Classe principale pour l'analyse de documents DOCX et l'ajout de placeholders
 */
export class AjoutPlaceholders {
  private contenuXml: string = '';
  private xmlParse: any;
  private readonly tagsExistants: Set<string> = new Set();

  constructor(private readonly cheminDocx: string) {}

  /**
   * Analyse complète du document
   * Retourne les zones vides détectées et le format de réponse pour ChatGPT
   */
  async analyser(): Promise<{
    sections: ZoneVide[];
    formatReponse: FormatReponse;
    promptSysteme: string;
  }> {
    // 1. Charger et parser le DOCX
    const { contenuXml, xmlParse } = await chargerEtParserDocx(this.cheminDocx);
    this.contenuXml = contenuXml;
    this.xmlParse = xmlParse;

    // 2. Extraire les placeholders existants
    const tagsExistants = extraireSDTExistants(this.contenuXml);
    tagsExistants.forEach(tag => this.tagsExistants.add(tag));

    // 3. Analyser les zones vides (sections et tableaux)
    const sections = extraireZonesVides(this.xmlParse, this.tagsExistants);

    // 4. Créer le format de réponse pour ChatGPT
    const formatReponse = creerFormatReponse(sections);
    const promptSysteme = creerPromptSysteme(sections);

    return { sections, formatReponse, promptSysteme };
  }
}
