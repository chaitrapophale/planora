import express from 'express';
import cors from 'cors';
import { CONFIG } from './config.js';
import { callGeminiAssistant } from './services/geminiService.js';
import { validateProposedAction } from './services/actionValidator.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check endpoint
const handleHealth = (req, res) => {
  res.json({
    status: 'ok',
    service: 'Planora GenAI Backend',
    provider: CONFIG.PROVIDER_NAME,
    model: CONFIG.AI_MODEL,
    hasApiKey: CONFIG.HAS_API_KEY,
    environmentConfigured: CONFIG.HAS_API_KEY
  });
};
app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// Conversational and Action Proposal Endpoint
const handleChat = async (req, res) => {
  try {
    const { message, history, eventContext, currentScreen } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message text is required' });
    }

    if (message.length > 4000) {
      return res.status(400).json({ error: 'Message exceeds 4,000 character limit' });
    }

    const aiResponse = await callGeminiAssistant({
      message: message.trim(),
      history: Array.isArray(history) ? history : [],
      eventContext: eventContext || {},
      currentScreen: currentScreen || 'dashboard'
    });

    res.json(aiResponse);
  } catch (err) {
    console.error('[Planora Server Error] /api/ai/chat failed:', err);
    res.status(500).json({
      error: 'Internal server error processing AI request',
      details: err.message
    });
  }
};
app.post('/api/ai/chat', handleChat);
app.post('/ai/chat', handleChat);

// Dedicated Full Event Plan Synthesis Endpoint
const handlePlan = async (req, res) => {
  try {
    const { prompt, eventContext } = req.body;
    const planPrompt = prompt || `Generate a comprehensive production blueprint for ${eventContext?.activeEvent?.name || 'our event'}.`;

    const aiResponse = await callGeminiAssistant({
      message: planPrompt,
      history: [],
      eventContext: eventContext || {},
      currentScreen: 'ai-planner'
    });

    res.json(aiResponse);
  } catch (err) {
    console.error('[Planora Server Error] /api/ai/plan failed:', err);
    res.status(500).json({
      error: 'Failed to synthesize event blueprint',
      details: err.message
    });
  }
};
app.post('/api/ai/plan', handlePlan);
app.post('/ai/plan', handlePlan);

// Action Validation Endpoint
const handleValidateAction = (req, res) => {
  const { action } = req.body;
  const validation = validateProposedAction(action);
  res.json(validation);
};
app.post('/api/ai/validate-action', handleValidateAction);
app.post('/ai/validate-action', handleValidateAction);

// Start Express server locally if not in Vercel serverless environment
const PORT = CONFIG.PORT;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Planora GenAI Backend Server active on port ${PORT}`);
    console.log(` Provider: ${CONFIG.PROVIDER_NAME} | Model: ${CONFIG.AI_MODEL}`);
    console.log(` Gemini API Key Configured: ${CONFIG.HAS_API_KEY ? 'YES (Live LLM Connected)' : 'NO (Local fallback active)'}`);
    console.log(` Health check: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

export default app;
