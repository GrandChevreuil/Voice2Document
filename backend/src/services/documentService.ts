import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
} from 'docx';

/**
 * Génère un document Word à partir d'une transcription
 * @param transcription - Le texte transcrit
 * @param title - Le titre du document
 * @returns Buffer du document Word
 */
export async function generateWordDocument(
  transcription: string,
  title: string
): Promise<Buffer> {
  try {
    const paragraphs = transcription
      .split('\n')
      .filter((line) => line.trim().length > 0);

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: title,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 400,
              },
            }),
            // Date de transcription
            new Paragraph({
              children: [
                new TextRun({
                  text: `Date de transcription: ${new Date().toLocaleDateString('fr-FR')}`,
                  italics: true,
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 600,
              },
            }),
            // Titre de la section
            new Paragraph({
              text: 'Transcription',
              heading: HeadingLevel.HEADING_2,
              spacing: {
                before: 400,
                after: 200,
              },
            }),
            // Contenu de la transcription
            ...paragraphs.map(
              (para) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: para,
                      size: 24,
                    }),
                  ],
                  spacing: {
                    after: 200,
                  },
                  alignment: AlignmentType.JUSTIFIED,
                })
            ),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    console.log('✅ Document Word généré avec succès');
    return buffer;
  } catch (error: any) {
    console.error('Erreur lors de la génération du document:', error);
    throw new Error(`Erreur de génération du document: ${error.message}`);
  }
}
