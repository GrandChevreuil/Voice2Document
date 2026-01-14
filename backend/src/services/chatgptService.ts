import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Améliore une transcription brute avec ChatGPT
 * Corrige les erreurs, supprime les répétitions et mots parasites, restructure le texte
 * @param transcription - Le texte brut de la transcription
 * @returns Le texte amélioré
 */
export async function improveTranscription(transcription: string): Promise<string> {
  try {
    const prompt = `Voici un texte brut issu d'une transcription audio. Ta mission :

1. **Corrige** les erreurs de transcription
2. **Supprime** les répétitions, hésitations (euh, hmm, etc.) et mots parasites
3. **Reformule** pour rendre le texte fluide et professionnel
4. **Restructure** le texte en paragraphes logiques et cohérents

Réponds UNIQUEMENT avec le texte corrigé, sans introduction ni commentaire.

Texte à améliorer :
${transcription}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en rédaction et en correction de texte. Tu transformes des transcriptions audio brutes en documents professionnels bien structurés. Tu ne réponds QUE avec le texte corrigé, sans aucun commentaire.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const texteAmeliore = response.choices[0]?.message?.content;

    if (!texteAmeliore) {
      throw new Error('Aucune réponse de ChatGPT');
    }

    console.log('✅ Amélioration terminée');

    return texteAmeliore.trim();
  } catch (error: any) {
    console.error('Erreur lors de l\'amélioration avec ChatGPT:', error);
    throw new Error(`Erreur d'amélioration: ${error.message}`);
  }
}
