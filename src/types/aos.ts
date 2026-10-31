/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — Authoritative DTO & Contract Definitions
 */

export interface AOSAccount {
  id: string;
  name: string;
  email: string;
  tenant_id: string;
  plan: 'Starter' | 'Professional' | 'Fleet Enterprise';
  status: 'active' | 'suspended';
  created_at: string;
  monthly_token_usage: number;
  monthly_token_limit: number;
}

export type DeviceType = 'mobile_phone' | 'tablet' | 'vehicle_display' | 'workstation';

export interface AOSDevice {
  id: string;
  name: string;
  type: DeviceType;
  platform: string;
  authorized_at: string;
  last_seen: string;
  status: 'active' | 'standby' | 'revoked';
  is_current: boolean;
  permitted_capabilities: string[];
}

export interface WidgetDefinition {
  id: string;
  component_type:
    | 'metric-group'
    | 'record-list'
    | 'intent-composer'
    | 'activity-list'
    | 'route-display'
    | 'notes-board';
  title: string;
  data_source: string;
  config?: Record<string, unknown>;
}

export interface SkinViewDefinition {
  id: string;
  title: string;
  icon?: string;
  widget_ids: string[];
}

export interface SkinManifest {
  schema_version: 'aos.skin.v0.1';
  skin_id: string;
  display_name: string;
  version: string;
  kind: 'demo' | 'production';
  description: string;
  tagline: string;
  icon: string;
  primary_color: string;
  accent_color: string;
  required_capabilities: string[];
  requested_permissions: string[];
  views: SkinViewDefinition[];
  widgets: WidgetDefinition[];
  installed: boolean;
  is_active: boolean;
}

export interface ProposedStep {
  step_number: number;
  title: string;
  description: string;
  permission_required: string;
  risk_level: 'low' | 'medium' | 'high';
  duration_est?: string;
}

export interface IntentProposal {
  id: string;
  tenant_id: string;
  source: 'gemini' | 'demo-mock';
  raw_intent: string;
  interpreted_goal: string;
  skin_id: string;
  proposed_steps: ProposedStep[];
  estimated_compute_tokens: number;
  requires_human_approval: boolean;
  status: 'draft' | 'approved' | 'rejected' | 'executed';
  created_at: string;
  evidence?: string;
}

// Canonical mcp-connector task states
export type CanonicalTaskState =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'timed_out';

export interface ActivityEvent {
  id: string;
  timestamp: string;
  device_id: string;
  device_name: string;
  action_type:
    | 'intent_submitted'
    | 'proposal_generated'
    | 'proposal_approved'
    | 'proposal_rejected'
    | 'task_completed'
    | 'skin_customized'
    | 'device_switched';
  summary: string;
  skin_id: string;
  canonical_status: CanonicalTaskState;
  source: 'live' | 'demo';
  metadata?: Record<string, unknown>;
}

export interface ExperienceLayoutConfig {
  skin_id: string;
  display_name: string;
  view_widget_order: Record<string, string[]>; // viewId -> widgetIds
  accent_color: string;
  updated_at: string;
  version: number;
}

// ==========================================
// AOS Model Router & Token Guard Definitions
// ==========================================

export type ModelTier =
  | 'tier0-local'      // Rules / regex / local scripts (0 tokens)
  | 'tier1-flash-lite' // Gemini 2.5 Flash-Lite (decomposition & raw parsing)
  | 'tier2-flash'      // Gemini 2.5 Flash (vision, routines, summaries)
  | 'tier3-pro';       // Gemini 2.5 Pro / Thinking (deep reasoning & code)

export interface ModelRouteDecision {
  tier: ModelTier;
  model_name: string;
  reason: string;
  estimated_tokens: number;
  estimated_cost_usd: number;
  savings_vs_pro_pct: number;
}

export interface IntentMicroStep {
  step_number: number;
  title: string;
  description: string;
  assigned_tier: ModelTier;
  requires_human_approval: boolean;
  permission_required?: string;
  risk_level: 'low' | 'medium' | 'high';
}

export interface DecomposedIntent {
  raw_intent: string;
  skin_id: string;
  classified_domain: string;
  complexity: 'simple' | 'moderate' | 'complex';
  route_decision: ModelRouteDecision;
  steps: IntentMicroStep[];
}

export interface TokenBudgetState {
  current_session_tokens: number;
  monthly_used_tokens: number;
  monthly_limit_tokens: number;
  total_savings_tokens: number;
  total_savings_usd: number;
}

// ==========================================
// Spatial & Sensor Context for "Etsin"
// ==========================================

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  accuracy_meters?: number;
  altitude_meters?: number;
  heading_degrees?: number;
}

export interface BiotopeSpot {
  id: string;
  title: string;
  direction: string; // e.g. "Länsi (W)"
  distance_meters: number;
  forest_type: string; // e.g. "Vanha tuore kuusikko"
  target_species: string[]; // e.g. ["Suppilovahvero", "Mustatorvisieni"]
  confidence_pct: number;
  moisture_index: 'kuiva' | 'tuore' | 'kostea' | 'märkä';
}

export interface SpeciesAssessment {
  species_name_fi: string;
  species_name_latin: string;
  confidence_pct: number;
  edibility: 'edible' | 'requires_cooking' | 'inedible' | 'toxic' | 'deadly';
  edibility_badge: '🟢 Syötävä' | '🟡 Vaatii esikäsittelyn' | '🔴 Myrkyllinen';
  lookalikes: string[];
  notes: string;
  timestamp: string;
  location?: GeoCoordinate;
}

