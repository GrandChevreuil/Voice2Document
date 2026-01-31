import type { ZoneVide, FormatReponse } from '../types';

/**
 * Crée le format de réponse JSON Schema pour ChatGPT
 */
export function creerFormatReponse(sections: ZoneVide[]): FormatReponse {
  const proprietes: Record<string, { type: string; description: string }> = {};
  
  for (const section of sections) {
    const nomChamp = section.placeholder.toLowerCase();
    
    // Description hiérarchique
    const description = section.parent
      ? `Contenu pour '${section.title}' (sous-section de '${section.parent}')`
      : `Contenu pour la section '${section.title}'`;
    
    proprietes[nomChamp] = {
      type: 'string',
      description
    };
  }
  
  const formatReponse: FormatReponse = {
    type: 'json_schema',
    json_schema: {
      name: 'document_transcription',
      strict: true,
      schema: {
        type: 'object',
        properties: proprietes,
        required: Object.keys(proprietes),
        additionalProperties: false
      }
    }
  };
  
  return formatReponse;
}

/**
 * Crée le prompt système pour ChatGPT
 */
export function creerPromptSysteme(sections: ZoneVide[]): string {
  const descriptionsSections: string[] = [];
  
  for (const section of sections) {
    if (section.parent) {
      descriptionsSections.push(
        `  - ${section.placeholder}: ${section.title} (dans ${section.parent})`
      );
    } else {
      descriptionsSections.push(
        `- ${section.placeholder}: ${section.title}`
      );
    }
  }

  const systemPrompt = `Tu es un assistant de transcription expert pour documents structurés.

L'audio contient des informations à placer dans différentes sections d'un document hiérarchisé.

**STRUCTURE DU DOCUMENT :**
${descriptionsSections.join('\n')}

**RÈGLES DE TRANSCRIPTION :**

1. **Marqueurs audio** : L'orateur peut annoncer les sections :
   - "Historique : ..." → remplir la section correspondante
   - "Les intervenants : ..." → remplir la sous-section correspondante
   
2. **Détection contextuelle** : Si pas de marqueur explicite, utilise le contexte :
   - Introduction/contexte → section correspondante
   - Détails techniques → sous-sections appropriées

3. **Sections vides** : Si une section n'est pas mentionnée, retourne ""

4. **Format** : 
   - Style professionnel
   - Paragraphes structurés
   - Conservation des termes techniques

5. **Hiérarchie** : Respecte la structure parent/sous-section

Retourne un JSON avec TOUTES les sections (vides si non mentionnées).`;
  
  return systemPrompt;
}
