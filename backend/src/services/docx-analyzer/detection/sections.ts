import type { ZoneVide } from '../types';
import { extraireTexteParagraphe, obtenirStyleParagraphe, aParagrapheVideApres } from './paragraphes';
import { genererPlaceholder } from '../placeholders/generateur';
import { extraireSectionsTableaux } from './tableaux';

// Fonctions permettant de détecter les zones vides dans les sections et sous-sections

/**
 * Traite une section C1 et détecte si elle contient une zone vide
 */
function traiterSectionC1(
  paragraphe: any,
  texte: string,
  paragraphes: any[],
  index: number,
  tagsExistants: Set<string>,
  sections: ZoneVide[]
): string {
  console.log(`\n🔷 Section C1 trouvée: '${texte}'`);
  
  if (aParagrapheVideApres(paragraphes, index, tagsExistants)) {
    const placeholder = genererPlaceholder(texte, tagsExistants);
    sections.push({
      title: texte,
      placeholder,
      position: index + 1,
      level: 'C1',
      parent: null,
      paraId: paragraphe['@_w14:paraId']
    });
    console.log(`  ✅ Zone vide détectée → ${placeholder}`);
  } else {
    console.log(`  ℹ️  Pas de zone vide, analyse des sous-sections...`);
  }
  
  return texte;
}

/**
 * Traite une sous-section Titre1 et détecte si elle contient une zone vide
 */
function traiterSectionTitre1(
  paragraphe: any,
  texte: string,
  paragraphes: any[],
  index: number,
  titreC1Actuel: string | null,
  tagsExistants: Set<string>,
  sections: ZoneVide[]
): string {
  console.log(`  🔹 Sous-section Titre1 trouvée: '${texte}'`);
  
  if (aParagrapheVideApres(paragraphes, index, tagsExistants)) {
    const placeholder = genererPlaceholder(texte, tagsExistants);
    sections.push({
      title: texte,
      placeholder,
      position: index + 1,
      level: 'Titre1',
      parent: titreC1Actuel,
      paraId: paragraphe['@_w14:paraId']
    });
    console.log(`    ✅ Zone vide détectée → ${placeholder}`);
  } else {
    console.log(`    ℹ️  Pas de zone vide`);
  }
  
  return texte;
}

/**
 * Extrait les zones à remplir avec support hiérarchique (C1, Titre1) et tableaux
 */
export function extraireZonesVides(
  xmlParse: any,
  tagsExistants: Set<string>
): ZoneVide[] {
  const sections: ZoneVide[] = [];
  
  // Récupérer tous les paragraphes
  const corps = xmlParse['w:document']['w:body'];
  const paragraphes = Array.isArray(corps['w:p']) ? corps['w:p'] : [corps['w:p']];
  
  let titreC1Actuel: string | null = null;
  let titreTitre1Actuel: string | null = null;
  
  console.log('\n' + '='.repeat(60));
  console.log('ANALYSE DES SECTIONS ET TABLEAUX');
  console.log('='.repeat(60));
  
  for (let i = 0; i < paragraphes.length; i++) {
    const paragraphe = paragraphes[i];
    if (!paragraphe) continue;
    
    const style = obtenirStyleParagraphe(paragraphe);
    const texte = extraireTexteParagraphe(paragraphe);
    
    if (style === 'C1' && texte) {
      titreC1Actuel = traiterSectionC1(paragraphe, texte, paragraphes, i, tagsExistants, sections);
      titreTitre1Actuel = null; // Reset de la sous-section
      continue;
    }
    
    if (style === 'Titre1' && texte) {
      titreTitre1Actuel = traiterSectionTitre1(paragraphe, texte, paragraphes, i, titreC1Actuel, tagsExistants, sections);
      continue;
    }
  }
  
  // ========================================
  // 3. ANALYSE DES TABLEAUX
  // ========================================
  const sectionsTableaux = extraireSectionsTableaux(
    xmlParse, 
    titreC1Actuel, 
    titreTitre1Actuel, 
    tagsExistants
  );
  sections.push(...sectionsTableaux);
  
  console.log('\n' + '='.repeat(60));
  console.log(`✅ ${sections.length} ZONES À REMPLIR DÉTECTÉES`);
  console.log(`   - Sections/Sous-sections: ${sections.filter(s => s.level !== 'TableCell').length}`);
  console.log(`   - Cellules de tableau: ${sections.filter(s => s.level === 'TableCell').length}`);
  console.log('='.repeat(60));
  
  return sections;
}
