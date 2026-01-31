/**
 * Génération de placeholders normalisés et uniques
 */

/**
 * Génère un placeholder normalisé depuis un titre
 * Gère automatiquement les doublons en ajoutant un compteur
 */
export function genererPlaceholder(titre: string, tagsExistants: Set<string>): string {
  // Normaliser les accents
  let normalise = titre.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  
  // Enlever les numéros de section (ex: "III. " ou "1.1 " ou "A) ")
  normalise = normalise.replace(/^[IVXLCDM\d]+[\.\)]\s*/gi, '');
  normalise = normalise.replace(/^[\d\w]+[\.\)]\s*/g, '');
  
  // Enlever la ponctuation
  normalise = normalise.replace(/[^\w\s]/g, '');
  
  // Espaces → underscores, majuscules
  normalise = normalise.trim().toUpperCase().replace(/\s+/g, '_');
  
  // Label du placeholder afin d'éviter les conflits avec les placeholders existants
  let placeholderBase = `AUDIO_${normalise}`;
  
  // Éviter les doublons
  let compteur = 1;
  let placeholderFinal = placeholderBase;
  while (tagsExistants.has(placeholderFinal)) {
    placeholderFinal = `${placeholderBase}_${compteur}`;
    compteur++;
  }
  
  // Ajouter à la liste des tags pour éviter les doublons futurs
  tagsExistants.add(placeholderFinal);
  
  return placeholderFinal;
}
