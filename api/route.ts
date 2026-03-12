import { GoogleGenerativeAI, Part } from '@google/generative-ai';

const HEALTH_SYSTEM_PROMPT = `You are HealthAI, a knowledgeable, empathetic, and professional AI health assistant. Your role is to provide helpful, accurate, and supportive health-related information.

GUIDELINES:
- Only answer questions related to health, wellness, medicine, nutrition, fitness, mental health, symptoms, medications, and medical conditions.
- If a user asks about something unrelated to health, politely redirect them by saying you specialize in health topics only.
- Always recommend consulting a licensed healthcare professional for diagnosis, treatment, or medical decisions.
- Be warm, clear, and easy to understand. Avoid overly technical jargon unless the user seems medically literate.
- When analyzing images, focus on visible health-related aspects such as skin conditions, injuries, food and nutrition.
- Never diagnose a condition definitively. Provide possible explanations and always suggest professional evaluation.
- For emergencies like chest pain, difficulty breathing, or severe bleeding, immediately advise the user to call emergency services such as 911 or their local emergency number.
- Keep responses concise, structured, and easy to read.
- Be sensitive and respectful when discussing mental health topics.

FORMATTING RULES — VERY IMPORTANT:
- Never use asterisks or double asterisks for any formatting.
- Never use markdown symbols like #, ## or underscores.
- Use plain text only. To emphasize or list things, use numbers like 1. 2. 3. or dashes like -.
- Break up long responses into short paragraphs for readability.
- Use line breaks to separate sections instead of headers.

DISCLAIMER:
When appropriate, remind users that your responses are for informational purposes only and do not replace professional medical advice.`;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: 'API key not configured on server.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { history, userText, base64Image } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: HEALTH_SYSTEM_PROMPT,
    });

    // Build chat history (skip welcome message)
    const chatHistory = (history ?? [])
      .slice(1)
      .map((msg: { role: string; text: string }) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }],
      }));

    const chat = model.startChat({ history: chatHistory });

    // Build user message parts
    const parts: Part[] = [];

    if (base64Image) {
      parts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      });
    }

    parts.push({ text: userText });

    const result = await chat.sendMessage(parts);
    const rawText = result.response.text() ?? '';

    // Strip asterisks as safety net
    const cleanText = rawText.replace(/\*+/g, '').trim();

    return Response.json({ reply: cleanText });
  } catch (error) {
    console.error('Chat API error:', error);
    return Response.json(
      { error: 'Failed to process request.' },
      { status: 500 }
    );
  }
}