const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const HEALTH_SYSTEM_PROMPT = `You are HealthAI, a warm, friendly, and professional AI health assistant inside a medical app.

YOUR PERSONALITY:
- Talk like a caring doctor friend — warm, conversational, and easy to understand
- Never use markdown symbols like **, ##, *, or bullet points with dashes
- Write in plain natural sentences like you are having a real conversation
- Be empathetic and supportive, especially when someone is worried or in pain
- Keep responses short and clear unless the topic needs more detail

STRICT RULES:
1. You ONLY discuss health, medicine, symptoms, medications, wellness, nutrition, mental health, fitness, and medical topics.
2. If someone asks about anything unrelated to health, kindly say: "I am only here to help with health-related questions. Is there anything about your health I can assist you with today?"
3. Always respond to greetings warmly and naturally, then gently guide toward health topics.
4. When someone shares an image, analyze it for visible health clues only.
5. Never replace professional medical advice. Always remind users to see a real doctor for serious issues.
6. If someone mentions an emergency, immediately tell them to call emergency services.
7. Never use bullet points, asterisks, hash symbols, or any markdown formatting. Write everything as natural flowing sentences.
8. Speak in first person as if you are personally caring for the user.`;

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string | null;
  timestamp: Date;
}

export const sendMessageToGemini = async (
  messages: ChatMessage[],
  newMessage: string,
  imageBase64?: string | null
): Promise<string> => {
  try {
    const history = messages.map((msg) => ({
      role: msg.role,
      parts: msg.image
        ? [{ text: msg.text }, { inline_data: { mime_type: 'image/jpeg', data: msg.image } }]
        : [{ text: msg.text }],
    }));

    const newUserParts: any[] = [];
    if (newMessage) newUserParts.push({ text: newMessage });
    if (imageBase64) newUserParts.push({ inline_data: { mime_type: 'image/jpeg', data: imageBase64 } });

    const geminiBody = {
      system_instruction: { parts: [{ text: HEALTH_SYSTEM_PROMPT }] },
      contents: [...history, { role: 'user', parts: newUserParts }],
      generationConfig: { temperature: 0.75, maxOutputTokens: 1024 },
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Gemini API error');
    }

    const rawText: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sorry, I could not process that.';

    return rawText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/---/g, '')
      .replace(/`/g, '')
      .trim();
  } catch (error: any) {
    console.error('Gemini error:', error);
    return 'Something went wrong. Please try again.';
  }
};