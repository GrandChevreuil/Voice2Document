import JSZip from 'jszip';
import { XMLParser } from 'fast-xml-parser';
import fs from 'node:fs';

/**
 * Charge un fichier DOCX et extrait/parse son contenu XML
 */
export async function chargerEtParserDocx(cheminDocx: string): Promise<{
  contenuXml: string;
  xmlParse: any;
}> {
  const donnees = fs.readFileSync(cheminDocx);
  const zip = await JSZip.loadAsync(donnees);
  const documentXml = await zip.file('word/document.xml')?.async('text');
  
  if (!documentXml) {
    throw new Error('Impossible de trouver word/document.xml dans le DOCX');
  }

  // Parser le XML
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    textNodeName: '#text',
    parseAttributeValue: false,
    trimValues: false
  });
  
  const xmlParse = parser.parse(documentXml);

  return { contenuXml: documentXml, xmlParse };
}

/**
 * Extrait tous les tags SDT (Structured Document Tag - placeholders) existants
 */
export function extraireSDTExistants(contenuXml: string): Set<string> {
  const tagsExistants = new Set<string>();
  
  // Trouver tous les w:sdt dans le XML brut
  const regexSdt = /<w:tag w:val="([^"]+)"\/>/g;
  let correspondance;
  
  while ((correspondance = regexSdt.exec(contenuXml)) !== null) {
    tagsExistants.add(correspondance[1]);
  }

  console.log(`📋 ${tagsExistants.size} placeholders existants détectés (ignorés)`);
  if (tagsExistants.size > 0) {
    console.log(`   Exemples: ${Array.from(tagsExistants).slice(0, 5).join(', ')}...`);
  }

  return tagsExistants;
}
