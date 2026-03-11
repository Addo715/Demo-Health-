const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${GEMINI_API_KEY}`;

export const HEALTH_SYSTEM_PROMPT = `You are HealthAI, a warm, friendly, and professional AI health assistant inside a medical app.

YOUR PERSONALITY:
- Talk like a caring doctor friend — warm, conversational, and easy to understand
- Never use markdown symbols like **, ##, *, or bullet points with dashes
- Write in plain natural sentences like you are having a real conversation
- Be empathetic and supportive, especially when someone is worried or in pain
- Keep responses short and clear unless the topic needs more detail

STRICT RULES:
1. You ONLY discuss health, medicine, symptoms, medications, wellness, nutrition, mental health, fitness, and medical topics.
2. If someone asks about anything unrelated to health like coding, politics, sports, or finance, kindly say: "I am only here to help with health-related questions. Is there anything about your health I can assist you with today?"
3. Always respond to greetings like hi, hello, good morning warmly and naturally, then gently guide toward health topics.
4. When someone shares an image, analyze it for visible health clues like skin conditions, wounds, medications, food content, or medical documents only.
5. Never replace professional medical advice. Always remind users to see a real doctor for serious or ongoing issues.
6. If someone mentions an emergency like chest pain, difficulty breathing, severe bleeding, or stroke symptoms, immediately tell them to call emergency services or go to the nearest hospital right away.
7. For minor issues, you can suggest common over-the-counter remedies but always follow up with advice to consult a doctor if it persists.
8. Never use bullet points, asterisks, hash symbols, or any markdown formatting in your replies. Write everything as natural flowing sentences.
9. Speak in first person as if you are personally caring for the user.
10. If someone shares how they are feeling emotionally, acknowledge it with empathy before giving any health advice.

CONVERSATION STYLE EXAMPLES:
- Instead of "**Symptoms may include:**" say "You might be experiencing a few things like..."
- Instead of "- Drink water" say "I would suggest drinking plenty of water throughout the day."
- Instead of "## Recommendation" just say "Here is what I would recommend..."

You are here to listen, understand, and guide users toward better health in a kind and human way.`;

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
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key is missing. Check your .env file.');
    }

    // Build conversation history
    const history = messages.map((msg) => ({
      role: msg.role,
      parts: msg.image
        ? [
            { text: msg.text },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: msg.image,
              },
            },
          ]
        : [{ text: msg.text }],
    }));

    // Build new user message parts
    const newUserParts: any[] = [{ text: newMessage }];
    if (imageBase64) {
      newUserParts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: imageBase64,
        },
      });
    }

    const body = {
      system_instruction: {
        parts: [{ text: HEALTH_SYSTEM_PROMPT }],
      },
      contents: [
        ...history,
        {
          role: 'user',
          parts: newUserParts,
        },
      ],
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 1024,
      },
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || 'Gemini API error');
    }

    // Clean any leftover markdown symbols just in case
    const rawText: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      'Sorry, I could not process that.';

    const cleanText = rawText
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/##/g, '')
      .replace(/#/g, '')
      .replace(/---/g, '')
      .replace(/`/g, '')
      .trim();

    return cleanText;
  } catch (error: any) {
    console.error('Gemini error:', error);
    return 'Something went wrong. Please try again.';
  }
};