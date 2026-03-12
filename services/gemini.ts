// import { ChatMessage } from '../types/chat';

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const GEMINI_API_URL =
//   'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent';

// const HEALTH_SYSTEM_PROMPT = `You are HealthAI, a knowledgeable, empathetic, and professional AI health assistant. Your role is to provide helpful, accurate, and supportive health-related information.

// GUIDELINES:
// - Only answer questions related to health, wellness, medicine, nutrition, fitness, mental health, symptoms, medications, and medical conditions.
// - If a user asks about something unrelated to health, politely redirect them by saying you specialize in health topics only.
// - Always recommend consulting a licensed healthcare professional for diagnosis, treatment, or medical decisions.
// - Be warm, clear, and easy to understand — avoid overly technical jargon unless the user seems medically literate.
// - When analyzing images, focus on visible health-related aspects (skin conditions, injuries, food/nutrition, etc.).
// - Never diagnose a condition definitively. Instead, provide possible explanations and always suggest professional evaluation.
// - For emergencies (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise the user to call emergency services (e.g., 911 or their local emergency number).
// - Keep responses concise, structured, and easy to read.
// - Be sensitive and respectful when discussing mental health topics.

// FORMATTING RULES (VERY IMPORTANT):
// - Never use asterisks (*) or double asterisks (**) for any formatting.
// - Never use markdown symbols like #, ##, or _.
// - Use plain text only. To emphasize or list things, use numbers (1. 2. 3.) or dashes (-) instead.
// - Break up long responses into short paragraphs for readability.
// - Use line breaks to separate sections instead of headers.

// DISCLAIMER:
// Always remind users when appropriate that your responses are for informational purposes only and do not replace professional medical advice.`;

// export async function sendMessageToGemini(
//   history: ChatMessage[],
//   userText: string,
//   base64Image?: string | null
// ): Promise<string> {
//   try {
//     // Build conversation history for Gemini (excluding the first welcome message)
//     const conversationHistory = history
//       .slice(1) // skip the initial welcome message
//       .map((msg) => ({
//         role: msg.role === 'user' ? 'user' : 'model',
//         parts: [{ text: msg.text }],
//       }));

//     // Build the current user message parts
//     const userParts: object[] = [];

//     if (base64Image) {
//       userParts.push({
//         inline_data: {
//           mime_type: 'image/jpeg',
//           data: base64Image,
//         },
//       });
//     }

//     userParts.push({ text: userText });

//     const requestBody = {
//       system_instruction: {
//         parts: [{ text: HEALTH_SYSTEM_PROMPT }],
//       },
//       contents: [
//         ...conversationHistory,
//         {
//           role: 'user',
//           parts: userParts,
//         },
//       ],
//       generationConfig: {
//         temperature: 0.7,
//         maxOutputTokens: 1024,
//       },
//     };

//     const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(requestBody),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Gemini API error:', errorData);
//       throw new Error(`API error: ${response.status}`);
//     }

//     const data = await response.json();
//     const rawText: string =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

//     // Strip any remaining asterisks just in case
//     return rawText.replace(/\*+/g, '').trim();
//   } catch (error) {
//     console.error('sendMessageToGemini error:', error);
//     return 'Sorry, I was unable to process your request right now. Please try again in a moment.';
//   }
// }


// import { ChatMessage } from '../types/chat';

// const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';
// const GEMINI_API_URL =
//   'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// const HEALTH_SYSTEM_PROMPT = `You are HealthAI, a knowledgeable, empathetic, and professional AI health assistant. Your role is to provide helpful, accurate, and supportive health-related information.

// GUIDELINES:
// - Only answer questions related to health, wellness, medicine, nutrition, fitness, mental health, symptoms, medications, and medical conditions.
// - If a user asks about something unrelated to health, politely redirect them by saying you specialize in health topics only.
// - Always recommend consulting a licensed healthcare professional for diagnosis, treatment, or medical decisions.
// - Be warm, clear, and easy to understand — avoid overly technical jargon unless the user seems medically literate.
// - When analyzing images, focus on visible health-related aspects (skin conditions, injuries, food/nutrition, etc.).
// - Never diagnose a condition definitively. Instead, provide possible explanations and always suggest professional evaluation.
// - For emergencies (chest pain, difficulty breathing, severe bleeding, etc.), immediately advise the user to call emergency services (e.g., 911 or their local emergency number).
// - Keep responses concise, structured, and easy to read.
// - Be sensitive and respectful when discussing mental health topics.

// FORMATTING RULES (VERY IMPORTANT):
// - Never use asterisks (*) or double asterisks (**) for any formatting.
// - Never use markdown symbols like #, ##, or _.
// - Use plain text only. To emphasize or list things, use numbers (1. 2. 3.) or dashes (-) instead.
// - Break up long responses into short paragraphs for readability.
// - Use line breaks to separate sections instead of headers.

// DISCLAIMER:
// Always remind users when appropriate that your responses are for informational purposes only and do not replace professional medical advice.`;

// export async function sendMessageToGemini(
//   history: ChatMessage[],
//   userText: string,
//   base64Image?: string | null
// ): Promise<string> {
//   if (!GEMINI_API_KEY) {
//     console.error('Gemini API key is missing.');
//     return 'Configuration error: API key not found. Please check your .env file.';
//   }

//   try {
//     // Inject system prompt as first user/model exchange — works on all Gemini versions
//     const systemTurn = [
//       {
//         role: 'user',
//         parts: [{ text: `SYSTEM INSTRUCTIONS:\n${HEALTH_SYSTEM_PROMPT}` }],
//       },
//       {
//         role: 'model',
//         parts: [{ text: 'Understood. I am HealthAI, ready to help with health-related questions.' }],
//       },
//     ];

//     // Build conversation history, skipping the welcome message
//     const conversationHistory = history
//       .slice(1)
//       .map((msg) => ({
//         role: msg.role === 'user' ? 'user' : 'model',
//         parts: [{ text: msg.text }],
//       }));

//     // Build current user message parts
//     const userParts: object[] = [];

//     if (base64Image) {
//       userParts.push({
//         inline_data: {
//           mime_type: 'image/jpeg',
//           data: base64Image,
//         },
//       });
//     }

//     userParts.push({ text: userText });

//     const requestBody = {
//       contents: [
//         ...systemTurn,
//         ...conversationHistory,
//         {
//           role: 'user',
//           parts: userParts,
//         },
//       ],
//       generationConfig: {
//         temperature: 0.7,
//         maxOutputTokens: 1024,
//       },
//     };

//     const response = await fetch(
//       `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(requestBody),
//       }
//     );

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.error('Gemini API error:', JSON.stringify(errorData));
//       throw new Error(`API error: ${response.status}`);
//     }

//     const data = await response.json();
//     const rawText: string =
//       data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

//     // Strip any remaining asterisks as a safety net
//     return rawText.replace(/\*+/g, '').trim();
//   } catch (error) {
//     console.error('sendMessageToGemini error:', error);
//     return 'Sorry, I was unable to process your request right now. Please try again in a moment.';
//   }
// }

import { ChatMessage } from '../types/chat';

export async function sendMessageToGemini(
  history: ChatMessage[],
  userText: string,
  base64Image?: string | null
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        history,
        userText,
        base64Image: base64Image ?? null,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Chat API error:', errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.reply ?? 'No response received.';
  } catch (error) {
    console.error('sendMessageToGemini error:', error);
    return 'Sorry, I was unable to process your request right now. Please try again in a moment.';
  }
}