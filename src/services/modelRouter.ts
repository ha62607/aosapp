/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Model Router & Token Guard v0.1
 * 
 * Implements:
 * - Tiered model routing (Tier 0 Local -> Tier 1 Flash-Lite -> Tier 2 Flash -> Tier 3 Pro)
 * - Multi-stage Intent Decomposition
 * - Token budget tracking and cost savings calculation
 */

import { GoogleGenAI } from '@google/genai';
import {
  DecomposedIntent,
  IntentMicroStep,
  ModelRouteDecision,
  ModelTier,
  TokenBudgetState,
} from '../types/aos';

// Estimated cost per 1M tokens (USD)
const MODEL_PRICING = {
  'tier0-local': { input: 0, output: 0 },
  'tier1-flash-lite': { input: 0.075, output: 0.30 }, // Gemini 3.5 Flash-Lite
  'tier2-flash': { input: 0.15, output: 0.60 },       // Gemini 3.8 Flash
  'tier3-pro': { input: 1.25, output: 5.00 },          // Gemini 3.8 Pro
};

// Global in-memory token budget state
const tokenBudget: TokenBudgetState = {
  current_session_tokens: 0,
  monthly_used_tokens: 14200,
  monthly_limit_tokens: 500000,
  total_savings_tokens: 38400,
  total_savings_usd: 0.19,
};

function getApiKey(): string {
  const isTestMode = typeof process !== 'undefined' && process.env?.AOS_TEST_MODE === 'true';
  if (isTestMode) return '';
  return (
    (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_GEMINI_API_KEY ||
    (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') ||
    ''
  );
}

/**
 * Tier 0: Instant Local Regex Matching (Zero tokens, Zero latency)
 */
function checkTier0Rules(rawIntent: string, skinId: string): DecomposedIntent | null {
  const normalized = rawIntent.trim().toLowerCase();

  const rules: { regex: RegExp; title: string; desc: string }[] = [
    {
      regex: /^(peruuta|keskeyt[aä]|sulje|stop|exit)$/i,
      title: 'Keskeytä nykyinen toiminto',
      desc: 'Paikallinen välitön komento suoritettu ilman verkkokutsuja.',
    },
    {
      regex: /^(kamera\s+(p[aä][aä]lle|aktiiviseksi|on))$/i,
      title: 'Aktivoi etsinkamera',
      desc: 'Herätä kamera passiivitilasta ja aloita reaaliaikainen ruutuskannaus.',
    },
    {
      regex: /^(kamera\s+(pois|passiiviseksi|off|s[aä][aä]st[oö]))$/i,
      title: 'Passivoi etsinkamera',
      desc: 'Sammuta kameravirta akun säästämiseksi.',
    },
    {
      regex: /^(mykist[aä]|mute)$/i,
      title: 'Mykistä mikrofoni',
      desc: 'Voice OS mikrofonin mykistys paikallisesti.',
    },
  ];

  for (const rule of rules) {
    if (rule.regex.test(normalized)) {
      const decision: ModelRouteDecision = {
        tier: 'tier0-local',
        model_name: 'AOS Local Rule Engine',
        reason: 'Tunnistettu suora laitekomento, ei tarvitse LLM-kutsua.',
        estimated_tokens: 0,
        estimated_cost_usd: 0,
        savings_vs_pro_pct: 100,
      };

      const step: IntentMicroStep = {
        step_number: 1,
        title: rule.title,
        description: rule.desc,
        assigned_tier: 'tier0-local',
        requires_human_approval: false,
        risk_level: 'low',
      };

      return {
        raw_intent: rawIntent,
        skin_id: skinId,
        classified_domain: 'system_command',
        complexity: 'simple',
        route_decision: decision,
        steps: [step],
      };
    }
  }

  return null;
}

/**
 * Main Routing & Decomposition function
 */
export async function routeAndDecomposeIntent(
  rawIntent: string,
  skinId: string
): Promise<DecomposedIntent> {
  // 1. Check Tier 0 first
  const tier0Result = checkTier0Rules(rawIntent, skinId);
  if (tier0Result) {
    return tier0Result;
  }

  const apiKey = getApiKey();

  // If live Gemini is configured, use Tier 1 (Gemini 2.5 Flash-Lite) to decompose
  if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are the AOS Tier 1 Intent Decomposer.
Your goal is to parse the user's intent, categorize its complexity, and split it into micro-steps.
Assign each micro-step to the cheapest viable model tier:
- "tier1-flash-lite": for simple parsing, file listing, status checks, format conversion
- "tier2-flash": for vision, routine summaries, multi-step coordination
- "tier3-pro": ONLY for complex code generation, architectural decisions, or deep reasoning

User request: "${rawIntent}"
Current Skin: "${skinId}"

Respond strictly in valid JSON matching this structure:
{
  "classified_domain": "e.g. devpc_management | field_foraging | voice_interaction | general",
  "complexity": "simple | moderate | complex",
  "recommended_tier": "tier1-flash-lite | tier2-flash | tier3-pro",
  "reason": "Brief Finnish justification for the chosen model tier",
  "steps": [
    {
      "step_number": 1,
      "title": "Short title",
      "description": "Step description",
      "assigned_tier": "tier1-flash-lite | tier2-flash | tier3-pro",
      "requires_human_approval": true,
      "permission_required": "e.g. remote.exec | camera.vision",
      "risk_level": "low | medium | high"
    }
  ]
}`;

      // Call Tier 1 (Flash-Lite) for fast, low-cost decomposition
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash-lite',
        contents: prompt,
      });

      const responseText = response.text || '';
      const cleanJson = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      const chosenTier: ModelTier = parsed.recommended_tier || 'tier2-flash';
      const estimatedTokens = 350;
      const costTier = MODEL_PRICING[chosenTier].input * (estimatedTokens / 1000000);
      const costPro = MODEL_PRICING['tier3-pro'].input * (estimatedTokens / 1000000);
      const savingsPct = costPro > 0 ? Math.round(((costPro - costTier) / costPro) * 100) : 0;

      // Update token budget
      tokenBudget.current_session_tokens += estimatedTokens;
      tokenBudget.monthly_used_tokens += estimatedTokens;
      tokenBudget.total_savings_tokens += (1000 - estimatedTokens);
      tokenBudget.total_savings_usd += Math.max(0, costPro - costTier);

      const decision: ModelRouteDecision = {
        tier: chosenTier,
        model_name: chosenTier === 'tier1-flash-lite' ? 'Gemini 3.5 Flash-Lite' : chosenTier === 'tier2-flash' ? 'Gemini 3.8 Flash' : 'Gemini 3.8 Pro',
        reason: parsed.reason || 'Automaattisesti optimoitu pienimmän kulun mukaan.',
        estimated_tokens: estimatedTokens,
        estimated_cost_usd: costTier,
        savings_vs_pro_pct: savingsPct,
      };

      return {
        raw_intent: rawIntent,
        skin_id: skinId,
        classified_domain: parsed.classified_domain || 'general',
        complexity: parsed.complexity || 'moderate',
        route_decision: decision,
        steps: parsed.steps || [],
      };
    } catch {
      // Fall through to deterministic fallback if API or JSON parse fails
    }
  }

  // Fallback heuristic decomposition
  const isComplex = /koodaa|refaktoroi|korjaa|arkkitehtuuri|suunnittele|debug/i.test(rawIntent);
  const isVision = /tunnista|kuva|sieni|marja|kamera/i.test(rawIntent);

  const fallbackTier: ModelTier = isComplex ? 'tier3-pro' : isVision ? 'tier2-flash' : 'tier1-flash-lite';
  const estimatedTokens = isComplex ? 950 : 280;
  const costTier = MODEL_PRICING[fallbackTier].input * (estimatedTokens / 1000000);
  const costPro = MODEL_PRICING['tier3-pro'].input * (estimatedTokens / 1000000);
  const savingsPct = Math.round(((costPro - costTier) / (costPro || 1)) * 100);

  tokenBudget.current_session_tokens += estimatedTokens;
  tokenBudget.monthly_used_tokens += estimatedTokens;

  return {
    raw_intent: rawIntent,
    skin_id: skinId,
    classified_domain: isVision ? 'field_foraging' : isComplex ? 'devpc_management' : 'general',
    complexity: isComplex ? 'complex' : 'simple',
    route_decision: {
      tier: fallbackTier,
      model_name: fallbackTier === 'tier3-pro' ? 'Gemini 2.5 Pro' : fallbackTier === 'tier2-flash' ? 'Gemini 2.5 Flash' : 'Gemini 2.5 Flash-Lite',
      reason: isComplex
        ? 'Tehtävä vaatii syvällistä päättelyä ja koodinmuokkausta.'
        : isVision
        ? 'Kuvankäsittely ja lajintunnistus suoritetaan nopealla multimodaalisella Flash-mallilla.'
        : 'Raakatehtävä suoritetaan edullisimmalla Flash-Lite -tasolla.',
      estimated_tokens: estimatedTokens,
      estimated_cost_usd: costTier,
      savings_vs_pro_pct: Math.max(0, savingsPct),
    },
    steps: [
      {
        step_number: 1,
        title: 'Analysoi syöte ja valmistele ympäristö',
        description: `Esisuodatus suoritettu (${fallbackTier}).`,
        assigned_tier: fallbackTier,
        requires_human_approval: false,
        risk_level: 'low',
      },
      {
        step_number: 2,
        title: 'Suorita pyydetty toimenpide',
        description: `Toteutetaan pyyntö: "${rawIntent}"`,
        assigned_tier: fallbackTier,
        requires_human_approval: isComplex,
        risk_level: isComplex ? 'medium' : 'low',
      },
    ],
  };
}

/**
 * Get current Token Budget & Savings stats
 */
export function getTokenBudgetState(): TokenBudgetState {
  return { ...tokenBudget };
}
