import OpenAI from 'openai';

function getClient() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  try { return new OpenAI({ apiKey: key }); } catch { return null; }
}

export async function generateObjectionHandling(context) {
  const client = getClient();
  if (!client) return null;
  const prompt = `Vous ?tes un closer commercial francophone. R?pondez de fa?on concise, empathique et orient?e action.\n\nContexte:\n${context}\n\nR?ponse:`;
  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        { role: 'system', content: 'Vous aidez ? qualifier et closer des prospects sur WhatsApp.' },
        { role: 'user', content: prompt }
      ]
    });
    return completion.choices?.[0]?.message?.content?.trim() || null;
  } catch {
    return null;
  }
}
