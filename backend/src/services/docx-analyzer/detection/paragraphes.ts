/**
 * Utilitaires pour la manipulation des paragraphes dans les documents Word XML
 */

/**
 * Extrait le texte d'un paragraphe de manière récursive
 */
export function extraireTexteParagraphe(paragraphe: any): string {
  if (!paragraphe) return '';

  let texte = '';

  // Fonction récursive pour extraire tout le texte
  const extractionTexte = (objet: any): void => {
    if (!objet) return;

    if (typeof objet === 'string') {
      texte += objet;
      return;
    }

    if (Array.isArray(objet)) {
      objet.forEach(element => extractionTexte(element));
      return;
    }

    if (typeof objet === 'object') {
      // Chercher les balises w:t
      if (objet['w:t']) {
        if (typeof objet['w:t'] === 'string') {
          texte += objet['w:t'];
        } else if (objet['w:t']['#text']) {
          texte += objet['w:t']['#text'];
        }
      }

      // Parcourir récursivement
      Object.values(objet).forEach(valeur => {
        if (valeur && typeof valeur === 'object') {
          extractionTexte(valeur);
        }
      });
    }
  };

  extractionTexte(paragraphe);
  return texte.trim();
}

/**
 * Récupère le style d'un paragraphe (C1, Titre1, etc.)
 */
export function obtenirStyleParagraphe(paragraphe: any): string | null {
  if (!paragraphe?.['w:pPr']) return null;
  
  const pPr = paragraphe['w:pPr'];
  const pStyle = pPr['w:pStyle'];
  
  if (!pStyle) return null;
  
  return pStyle['@_w:val'] || null;
}

/**
 * Vérifie si un paragraphe contient un SDT avec tag existant
 */
export function contientTagSDT(paragraphe: any, tagsExistants: Set<string>): boolean {
  const paragrapheStr = JSON.stringify(paragraphe);
  
  // Chercher w:sdt avec w:tag dans la représentation du paragraphe
  for (const tag of tagsExistants) {
    if (paragrapheStr.includes(tag)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Vérifie s'il y a un paragraphe vide après l'index donné
 */
export function aParagrapheVideApres(
  paragraphes: any[], 
  indexActuel: number, 
  tagsExistants: Set<string>
): boolean {
  const indexSuivant = indexActuel + 1;
  
  if (indexSuivant >= paragraphes.length) {
    return false;
  }

  const paragrSuivant = paragraphes[indexSuivant];
  
  // Vérifier que le paragraphe est vide
  const texte = extraireTexteParagraphe(paragrSuivant);
  
  // Vérifier qu'il ne contient pas de SDT avec tag existant
  const aSdt = contientTagSDT(paragrSuivant, tagsExistants);
  
  // Vérifier que le style n'est pas un titre
  const style = obtenirStyleParagraphe(paragrSuivant);
  const nestPasTitre = !['C1', 'Titre1'].includes(style || '');
  
  return texte === '' && !aSdt && nestPasTitre;
}
