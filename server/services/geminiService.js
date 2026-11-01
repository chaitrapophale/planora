/**
 * Real Google Gemini LLM Service Integration
 * Modular service communicating directly with Google Generative Language API
 */

import { CONFIG } from '../config.js';
import { buildSystemInstruction } from './planoraPrompt.js';
import { validateProposedAction } from './actionValidator.js';
import { generateFallbackResponse } from './localFallbackService.js';

export async function callGeminiAssistant({
  message,
  history = [],
  eventContext = {},
  currentScreen = 'dashboard'
}) {
  const { GEMINI_API_KEY, AI_MODEL, HAS_API_KEY } = CONFIG;

  // If no valid API key is configured, invoke the smart local fallback
  if (!HAS_API_KEY) {
    console.log('[Planora AI] No live GEMINI_API_KEY detected. Using intelligent fallback engine.');
    const fallback = generateFallbackResponse({ message, eventContext, currentScreen, history });
    return {
      ...fallback,
      isLiveLLM: false,
      provider: 'Local Assistant Engine (No GEMINI_API_KEY configured in .env)',
      model: 'deterministic-fallback',
      statusNotice: 'Running in local preview mode. Add your GEMINI_API_KEY to .env for live Gemini 2.5 Flash GenAI reasoning.'
    };
  }

  const systemInstructionText = buildSystemInstruction(eventContext, currentScreen);

  // Format conversational history for Gemini ('user' and 'model' roles)
  const formattedContents = [];

  // Limit conversation history to last 10 turns to conserve context tokens
  const recentHistory = (history || []).slice(-10);
  for (const turn of recentHistory) {
    if (turn.role === 'user') {
      formattedContents.push({
        role: 'user',
        parts: [{ text: turn.content || '' }]
      });
    } else if (turn.role === 'assistant' || turn.role === 'model') {
      formattedContents.push({
        role: 'model',
        parts: [{ text: typeof turn.content === 'string' ? turn.content : JSON.stringify(turn.content) }]
      });
    }
  }

  // Append current user message
  formattedContents.push({
    role: 'user',
    parts: [{ text: message }]
  });

  const requestBody = {
    contents: formattedContents,
    systemInstruction: {
      parts: [{ text: systemInstructionText }]
    },
    generationConfig: {
      temperature: 0.7,
      topP: 0.95,
      responseMimeType: 'application/json'
    }
  };

  const candidateModels = Array.from(new Set([
    AI_MODEL,
    'gemini-3-flash-preview',
    'gemini-3.5-flash',
    'gemini-3.8-flash'
  ].filter(Boolean)));

  let lastError = null;
  let responseData = null;
  let activeModelUsed = AI_MODEL;

  for (const modelToTry of candidateModels) {
    const endpointUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToTry}:generateContent?key=${GEMINI_API_KEY}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout per candidate

      const response = await fetch(endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        responseData = await response.json();
        activeModelUsed = modelToTry;
        break;
      }

      const errText = await response.text();
      console.warn(`[Planora AI] Gemini model ${modelToTry} returned HTTP ${response.status}:`, errText.substring(0, 150));
      lastError = { status: response.status, text: errText };

      // If unauthorized key (400 or 403), do not retry other models as key is invalid
      if (response.status === 400 || response.status === 403) {
        break;
      }
    } catch (netErr) {
      console.warn(`[Planora AI] Network failure trying model ${modelToTry}:`, netErr.message);
      lastError = { status: 0, text: netErr.message };
    }
  }

  try {
    if (!responseData) {
      let userFriendlyError = 'The AI service encountered an error communicating with Google Gemini.';
      if (lastError?.status === 400 || lastError?.status === 403) {
        userFriendlyError = 'Invalid or unauthorized GEMINI_API_KEY. Please verify your API key in .env.';
      } else if (lastError?.status === 429) {
        userFriendlyError = 'Gemini API rate limit or quota exceeded. Please wait a moment and retry.';
      }

      const fallback = generateFallbackResponse({ message, eventContext, currentScreen, history });
      return {
        ...fallback,
        isLiveLLM: false,
        apiError: {
          status: lastError?.status || 500,
          message: userFriendlyError
        },
        provider: 'Google Gemini (Error Fallback)',
        model: activeModelUsed,
        statusNotice: `Gemini API Notice: ${userFriendlyError} Providing intelligent domain response.`
      };
    }

    const candidateText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error('No candidate content returned by Gemini API');
    }

    // Clean markdown code blocks if Gemini wrapped JSON in ```json ... ```
    let cleanJson = candidateText.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
    }

    let parsedResult;
    try {
      parsedResult = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('[Planora AI] Failed to parse JSON from Gemini candidate. Treating as plaintext reply.', parseErr);
      parsedResult = {
        reply: candidateText,
        action: null,
        plan: null,
        suggestedPrompts: [
          'What should I prioritize next?',
          'Check budget allocation for this event'
        ],
        isEstimateNotice: 'Generated by Google Gemini.'
      };
    }

    // Validate proposed action if present
    if (parsedResult.action) {
      const validation = validateProposedAction(parsedResult.action);
      if (!validation.isValid) {
        console.warn('[Planora AI] Discarding invalid proposed action from LLM:', validation.error);
        parsedResult.action = null;
      }
    }

    return {
      reply: parsedResult.reply || 'Here are the event recommendations based on your current workspace.',
      action: parsedResult.action || null,
      plan: parsedResult.plan || null,
      suggestedPrompts: Array.isArray(parsedResult.suggestedPrompts) ? parsedResult.suggestedPrompts : [],
      isEstimateNotice: parsedResult.isEstimateNotice || 'Estimates are algorithmically calculated.',
      isLiveLLM: true,
      provider: 'Google Gemini (Connected)',
      model: activeModelUsed
    };

  } catch (networkError) {
    console.error('[Planora AI] Network exception contacting Gemini API:', networkError);
    const fallback = generateFallbackResponse({ message, eventContext, currentScreen, history });
    return {
      ...fallback,
      isLiveLLM: false,
      apiError: {
        message: networkError.name === 'AbortError' ? 'AI request timed out' : networkError.message
      },
      provider: 'Google Gemini (Offline / Fallback)',
      model: AI_MODEL,
      statusNotice: 'Unable to reach Google Gemini API. Displaying local tactical recommendations.'
    };
  }
}
