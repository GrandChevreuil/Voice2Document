import type { ZoneVide } from '../types';
import { extraireTexteParagraphe, contientTagSDT } from './paragraphes';
import { genererPlaceholder } from '../placeholders/generateur';

// Fonctions permettant la detection de cellules vides d'un tableau.

/**
 * Extrait les en-têtes d'un tableau (première ligne)
 */
export function extraireEntetesTableau(tableau: any): string[] {
  const entetes: string[] = [];
  
  const lignes = Array.isArray(tableau['w:tr']) ? tableau['w:tr'] : [tableau['w:tr']];
  if (lignes.length === 0) return entetes;
  
  const premiereLigne = lignes[0];
  const cellules = Array.isArray(premiereLigne['w:tc']) ? premiereLigne['w:tc'] : [premiereLigne['w:tc']];
  
  for (const cellule of cellules) {
    if (!cellule) continue;
    const texte = extraireTexteParagraphe(cellule);
    entetes.push(texte || 'Col');
  }
  
  return entetes;
}

/**
 * Analyse les tableaux et détecte les cellules vides
 */
export function extraireSectionsTableaux(
  xmlParse: any,
  titreC1Actuel: string | null,
  titreTitre1Actuel: string | null,
  tagsExistants: Set<string>
): ZoneVide[] {
  const sections: ZoneVide[] = [];
  const corps = xmlParse['w:document']['w:body'];
  
  // Récupérer tous les tableaux
  const tableaux = corps['w:tbl'];
  if (!tableaux) return sections;
  
  const tableauxArray = Array.isArray(tableaux) ? tableaux : [tableaux];
  
  console.log(`\n📊 Analyse de ${tableauxArray.length} tableau(x)`);
  
  tableauxArray.forEach((tableau, indexTableau) => {
    if (!tableau) return;
    
    // Extraire les en-têtes
    const entetes = extraireEntetesTableau(tableau);
    console.log(`\n  📋 Tableau ${indexTableau + 1} - Colonnes: ${entetes.join(', ')}`);
    
    // Parcourir les lignes
    const lignes = Array.isArray(tableau['w:tr']) ? tableau['w:tr'] : [tableau['w:tr']];
    
    lignes.forEach((ligne, indexLigne) => {
      if (!ligne || indexLigne === 0) return; // Ignorer la ligne d'en-tête
      
      const cellules = Array.isArray(ligne['w:tc']) ? ligne['w:tc'] : [ligne['w:tc']];
      
      cellules.forEach((cellule, indexColonne) => {
        if (!cellule) return;
        
        // Vérifier si la cellule est vide
        const texteCellule = extraireTexteParagraphe(cellule);
        const aSdt = contientTagSDT(cellule, tagsExistants);
        
        if (!texteCellule && !aSdt) {
          // Cellule vide détectée
          const nomColonne = entetes[indexColonne] || `Col${indexColonne + 1}`;
          const titreContexte = titreTitre1Actuel || titreC1Actuel || 'Table';
          
          // Générer un placeholder descriptif
          const placeholderBase = `${titreContexte}_${nomColonne}_L${indexLigne + 1}`;
          const placeholder = genererPlaceholder(placeholderBase, tagsExistants);
          
          sections.push({
            title: `${titreContexte} - ${nomColonne} (Ligne ${indexLigne + 1})`,
            placeholder,
            position: -1, // Pas de position de paragraphe
            level: 'TableCell',
            parent: titreTitre1Actuel || titreC1Actuel,
            tableContext: {
              tableIndex: indexTableau,
              rowIndex: indexLigne,
              colIndex: indexColonne,
              headerRow: entetes
            }
          });
          
          console.log(`    📝 Cellule vide [L${indexLigne + 1}, C${indexColonne + 1}] "${nomColonne}" → ${placeholder}`);
        }
      });
    });
  });
  
  return sections;
}
