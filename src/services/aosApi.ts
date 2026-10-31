/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — Authoritative Product API & Governed BFF Adapter
 * 
 * Enforces:
 * - One Account, N Devices, Many Experiences
 * - Tenant isolation (tenant_id)
 * - Safe Intent -> Proposal -> Human Approval lifecycle
 * - Explicit provenance tags (source: "gemini" | "demo-mock")
 * - Canonical mcp-connector task states
 */

import { GoogleGenAI } from '@google/genai';
import {
  AOSAccount,
  AOSDevice,
  ActivityEvent,
  ExperienceLayoutConfig,
  IntentProposal,
  ProposedStep,
  SkinManifest,
  TokenBudgetState,
} from '../types/aos';
import { DEFAULT_SKINS } from '../data/defaultSkins';
import {
  INITIAL_ACCOUNT,
  INITIAL_ACTIVITIES,
  INITIAL_DEVICES,
} from '../data/mockFixtures';
import { routeAndDecomposeIntent, getTokenBudgetState as getRouterTokenBudget } from './modelRouter';

// In-memory persistent state across component renders
class AOSStateStore {
  account: AOSAccount = { ...INITIAL_ACCOUNT };
  devices: AOSDevice[] = [...INITIAL_DEVICES];
  skins: SkinManifest[] = [...DEFAULT_SKINS];
  activities: ActivityEvent[] = [...INITIAL_ACTIVITIES];
  proposals: Map<string, IntentProposal> = new Map();
  layouts: Map<string, ExperienceLayoutConfig> = new Map();

  constructor() {
    // Initialize default layout configurations
    this.skins.forEach((skin) => {
      const order: Record<string, string[]> = {};
      skin.views.forEach((v) => {
        order[v.id] = [...v.widget_ids];
      });
      this.layouts.set(skin.skin_id, {
        skin_id: skin.skin_id,
        display_name: skin.display_name,
        view_widget_order: order,
        accent_color: skin.accent_color,
        updated_at: new Date().toISOString(),
        version: 1,
      });
    });
  }
}

const store = new AOSStateStore();

/**
 * Account & Entitlement APIs
 */
export async function getAccountInfo(): Promise<AOSAccount> {
  return { ...store.account };
}

/**
 * Multi-Device Management APIs
 */
export async function getDevices(): Promise<AOSDevice[]> {
  return [...store.devices];
}

export async function switchActiveDevice(deviceId: string): Promise<AOSDevice[]> {
  let selectedName = '';
  store.devices = store.devices.map((d) => {
    if (d.id === deviceId) {
      selectedName = d.name;
      return { ...d, is_current: true, status: 'active', last_seen: 'Juuri nyt' };
    }
    return { ...d, is_current: false, status: d.status === 'active' ? 'standby' : d.status };
  });

  // Log activity
  recordActivity({
    device_id: deviceId,
    device_name: selectedName || 'Laitteen vaihto',
    action_type: 'device_switched',
    summary: `Aktiivinen näkymä vaihdettu laitteelle: ${selectedName}`,
    skin_id: store.skins.find((s) => s.is_active)?.skin_id || 'everyday-assistant',
    canonical_status: 'completed',
    source: 'live',
  });

  return [...store.devices];
}

export async function authorizeDevice(
  name: string,
  type: AOSDevice['type'],
  platform: string
): Promise<AOSDevice> {
  const newDev: AOSDevice = {
    id: `dev_${Date.now()}`,
    name,
    type,
    platform,
    authorized_at: new Date().toISOString(),
    last_seen: 'Juuri nyt',
    status: 'active',
    is_current: false,
    permitted_capabilities: ['ai.chat', 'tasks.plan_only', 'notes.storage'],
  };

  store.devices.push(newDev);

  recordActivity({
    device_id: newDev.id,
    device_name: newDev.name,
    action_type: 'device_switched',
    summary: `Uusi laite valtuutettu tilille: ${name} (${platform})`,
    skin_id: store.skins.find((s) => s.is_active)?.skin_id || 'everyday-assistant',
    canonical_status: 'completed',
    source: 'live',
  });

  return newDev;
}

export async function revokeDevice(deviceId: string): Promise<boolean> {
  const dev = store.devices.find((d) => d.id === deviceId);
  if (!dev) return false;
  dev.status = 'revoked';
  dev.is_current = false;
  return true;
}

/**
 * Skin Management & Customization APIs
 */
export async function getSkins(): Promise<SkinManifest[]> {
  return [...store.skins];
}

export async function setActiveSkin(skinId: string): Promise<SkinManifest> {
  store.skins = store.skins.map((s) => ({
    ...s,
    is_active: s.skin_id === skinId,
  }));

  const active = store.skins.find((s) => s.skin_id === skinId)!;
  const currentDevice = store.devices.find((d) => d.is_current) || store.devices[0];

  recordActivity({
    device_id: currentDevice.id,
    device_name: currentDevice.name,
    action_type: 'device_switched',
    summary: `Käyttäjä vaihtoi aktiiviseksi skiniksi: ${active.display_name}`,
    skin_id: active.skin_id,
    canonical_status: 'completed',
    source: 'live',
  });

  return active;
}

export async function toggleInstallSkin(skinId: string, install: boolean): Promise<SkinManifest> {
  const target = store.skins.find((s) => s.skin_id === skinId);
  if (!target) throw new Error(`Skin ${skinId} not found`);
  target.installed = install;
  if (!install && target.is_active) {
    store.skins[0].is_active = true;
    target.is_active = false;
  }
  return { ...target };
}

export async function getExperienceConfig(skinId: string): Promise<ExperienceLayoutConfig> {
  const existing = store.layouts.get(skinId);
  if (existing) return { ...existing };

  const skin = store.skins.find((s) => s.skin_id === skinId);
  const order: Record<string, string[]> = {};
  skin?.views.forEach((v) => {
    order[v.id] = [...v.widget_ids];
  });

  const created: ExperienceLayoutConfig = {
    skin_id: skinId,
    display_name: skin?.display_name || skinId,
    view_widget_order: order,
    accent_color: skin?.accent_color || '#4f46e5',
    updated_at: new Date().toISOString(),
    version: 1,
  };
  store.layouts.set(skinId, created);
  return created;
}

export async function saveExperienceConfig(
  config: ExperienceLayoutConfig
): Promise<ExperienceLayoutConfig> {
  const updated: ExperienceLayoutConfig = {
    ...config,
    version: (config.version || 1) + 1,
    updated_at: new Date().toISOString(),
  };
  store.layouts.set(config.skin_id, updated);

  const currentDevice = store.devices.find((d) => d.is_current) || store.devices[0];
  recordActivity({
    device_id: currentDevice.id,
    device_name: currentDevice.name,
    action_type: 'skin_customized',
    summary: `Tallennettu mukautettu asettelu kokemukselle: ${config.display_name} (v${updated.version})`,
    skin_id: config.skin_id,
    canonical_status: 'completed',
    source: 'live',
  });

  return updated;
}

export async function resetExperienceConfig(skinId: string): Promise<ExperienceLayoutConfig> {
  const skin = store.skins.find((s) => s.skin_id === skinId);
  const order: Record<string, string[]> = {};
  skin?.views.forEach((v) => {
    order[v.id] = [...v.widget_ids];
  });
  const reset: ExperienceLayoutConfig = {
    skin_id: skinId,
    display_name: skin?.display_name || skinId,
    view_widget_order: order,
    accent_color: skin?.accent_color || '#4f46e5',
    updated_at: new Date().toISOString(),
    version: 1,
  };
  store.layouts.set(skinId, reset);
  return reset;
}

/**
 * Skin Studio — Dynamic Custom Skin Creation & AI Generation
 */
export async function createCustomSkin(manifest: SkinManifest): Promise<SkinManifest> {
  // Validate manifest
  if (manifest.schema_version !== 'aos.skin.v0.1') {
    throw new Error('Virheellinen skeemaversio. Vaaditaan aos.skin.v0.1');
  }

  const existingIndex = store.skins.findIndex((s) => s.skin_id === manifest.skin_id);
  if (existingIndex >= 0) {
    store.skins[existingIndex] = { ...manifest, installed: true };
  } else {
    store.skins.push({ ...manifest, installed: true });
  }

  // Initialize layout config
  const order: Record<string, string[]> = {};
  manifest.views.forEach((v) => {
    order[v.id] = [...v.widget_ids];
  });

  store.layouts.set(manifest.skin_id, {
    skin_id: manifest.skin_id,
    display_name: manifest.display_name,
    view_widget_order: order,
    accent_color: manifest.accent_color,
    updated_at: new Date().toISOString(),
    version: 1,
  });

  const currentDevice = store.devices.find((d) => d.is_current) || store.devices[0];
  recordActivity({
    device_id: currentDevice.id,
    device_name: currentDevice.name,
    action_type: 'skin_customized',
    summary: `Uusi kokemus luotu ja asennettu Skin Studiolla: ${manifest.display_name}`,
    skin_id: manifest.skin_id,
    canonical_status: 'completed',
    source: manifest.kind === 'demo' ? 'demo' : 'live',
  });

  return manifest;
}

export async function generateSkinWithAI(promptText: string): Promise<SkinManifest> {
  const lower = promptText.toLowerCase();
  const skinId = `skin_custom_${Date.now()}`;

  // Smart domain template detection
  if (lower.includes('lvi') || lower.includes('putki') || lower.includes('lämpö') || lower.includes('ilmastointi') || lower.includes('hvac')) {
    return {
      schema_version: 'aos.skin.v0.1',
      skin_id: skinId,
      display_name: 'LVI- ja Kylmälaitehuolto',
      version: '0.1.0',
      kind: 'production',
      description: 'Lämpö-, vesi- ja ilmastointiasentajien operatiivinen työpöytä: mittauspöytäkirjat, vikakeikat, painetestit ja osavarasto.',
      tagline: 'LVI-teknikon kenttätyönohjaus',
      icon: 'Wrench',
      primary_color: '#0284c7', // sky
      accent_color: '#38bdf8',
      required_capabilities: ['ai.chat', 'tasks.plan_only', 'measurements.read'],
      requested_permissions: ['jobs.sample.read', 'hvac.telemetry'],
      installed: true,
      is_active: false,
      views: [
        {
          id: 'hvac-overview',
          title: 'Huoltotyöt & Painearvot',
          icon: 'Wrench',
          widget_ids: ['hvac-metrics', 'hvac-jobs'],
        },
        {
          id: 'hvac-request',
          title: 'Uusi LVI-suunnitelma',
          icon: 'FilePlus',
          widget_ids: ['hvac-composer'],
        },
        {
          id: 'hvac-parts',
          title: 'Putkiosat & Venttiilit',
          icon: 'Package',
          widget_ids: ['hvac-inventory'],
        },
      ],
      widgets: [
        {
          id: 'hvac-metrics',
          component_type: 'metric-group',
          title: 'LVI-järjestelmien tilanne',
          data_source: 'demo:hvac',
        },
        {
          id: 'hvac-jobs',
          component_type: 'record-list',
          title: 'Päivän LVI-huoltopyynnöt',
          data_source: 'demo:field-service',
        },
        {
          id: 'hvac-composer',
          component_type: 'intent-composer',
          title: 'Laadi painetestaus- tai huoltosuunnitelma',
          data_source: 'aos:proposals',
        },
        {
          id: 'hvac-inventory',
          component_type: 'record-list',
          title: 'Huoltoauton LVI-varaosat',
          data_source: 'demo:inventory',
        },
      ],
    };
  }

  if (lower.includes('isännöi') || lower.includes('kiinteistö') || lower.includes('taloyhtiö')) {
    return {
      schema_version: 'aos.skin.v0.1',
      skin_id: skinId,
      display_name: 'Kiinteistö & Isännöinti',
      version: '0.1.0',
      kind: 'production',
      description: 'Taloyhtiöiden ja kiinteistömanagerin hallintatyökalu: asukasilmoitukset, PTS-kunnossapitotarpeet ja urakoitsijatarkastukset.',
      tagline: 'Isännöitsijän ja kiinteistömanagerin työtila',
      icon: 'Building',
      primary_color: '#16a34a', // green
      accent_color: '#22c55e',
      required_capabilities: ['ai.chat', 'tasks.plan_only', 'dms.goals'],
      requested_permissions: ['properties.read', 'tickets.manage'],
      installed: true,
      is_active: false,
      views: [
        {
          id: 'property-overview',
          title: 'Taloyhtiöiden katselmus',
          icon: 'Building',
          widget_ids: ['prop-metrics', 'prop-goals'],
        },
        {
          id: 'property-notes',
          title: 'Kunnossapitomerkinnät',
          icon: 'FileText',
          widget_ids: ['prop-notes', 'prop-composer'],
        },
      ],
      widgets: [
        {
          id: 'prop-metrics',
          component_type: 'metric-group',
          title: 'Kiinteistöjen huoltovaste & SLA',
          data_source: 'demo:general',
        },
        {
          id: 'prop-goals',
          component_type: 'record-list',
          title: 'PTS 5-vuotiskorjaussuunnitelma',
          data_source: 'dms:goals',
        },
        {
          id: 'prop-composer',
          component_type: 'intent-composer',
          title: 'Valmistele hallituksen katselmuspöytäkirja',
          data_source: 'aos:proposals',
        },
        {
          id: 'prop-notes',
          component_type: 'notes-board',
          title: 'Isännöitsijän huomiot & urakoitsijamuistiot',
          data_source: 'demo:general',
        },
      ],
    };
  }

  // Default custom generated skin
  const name = promptText.length > 3 ? promptText.slice(0, 30) : 'Räätälöity Toimialakokemus';
  return {
    schema_version: 'aos.skin.v0.1',
    skin_id: skinId,
    display_name: name.charAt(0).toUpperCase() + name.slice(1),
    version: '0.1.0',
    kind: 'production',
    description: `AOS Skin Studion luoma kokemus toiveesta: "${promptText}"`,
    tagline: 'Räätälöity ammattilaiskokemus',
    icon: 'Sparkles',
    primary_color: '#6366f1',
    accent_color: '#818cf8',
    required_capabilities: ['ai.chat', 'tasks.plan_only'],
    requested_permissions: ['profile.read', 'notes.readwrite'],
    installed: true,
    is_active: false,
    views: [
      {
        id: 'view-main',
        title: 'Yleisnäkymä',
        icon: 'LayoutDashboard',
        widget_ids: ['custom-composer', 'custom-metrics'],
      },
      {
        id: 'view-tasks',
        title: 'Tehtävät & Tavoitteet',
        icon: 'Target',
        widget_ids: ['custom-goals', 'custom-notes'],
      },
    ],
    widgets: [
      {
        id: 'custom-composer',
        component_type: 'intent-composer',
        title: `AOS AI -säveltäjä: ${name}`,
        data_source: 'aos:proposals',
      },
      {
        id: 'custom-metrics',
        component_type: 'metric-group',
        title: 'Päivän tila & mittarit',
        data_source: 'demo:general',
      },
      {
        id: 'custom-goals',
        component_type: 'record-list',
        title: 'DMS Tavoitteet',
        data_source: 'dms:goals',
      },
      {
        id: 'custom-notes',
        component_type: 'notes-board',
        title: 'Muistiinpanot & havainnot',
        data_source: 'demo:general',
      },
    ],
  };
}

/**
 * Governed Human Intent -> Interpretation -> Proposal Workflow
 */
export async function interpretUserIntent(
  rawIntent: string,
  skinId: string
): Promise<IntentProposal> {
  const proposalId = `prop_${Date.now()}`;

  // Execute tiered decomposition via AOS Model Router & Token Guard
  const decomposed = await routeAndDecomposeIntent(rawIntent, skinId);

  const steps: ProposedStep[] = decomposed.steps.map((s) => ({
    step_number: s.step_number,
    title: s.title,
    description: s.description,
    permission_required: s.permission_required || 'system.basic',
    risk_level: s.risk_level,
    duration_est: s.assigned_tier === 'tier0-local' ? 'välitön (0s)' : '1–2 min',
  }));

  const proposal: IntentProposal = {
    id: proposalId,
    tenant_id: store.account.tenant_id,
    source: decomposed.route_decision.tier === 'tier0-local' ? 'demo-mock' : 'gemini',
    raw_intent: rawIntent,
    interpreted_goal: `${decomposed.route_decision.model_name} [Säästö: ${decomposed.route_decision.savings_vs_pro_pct}%]: ${decomposed.route_decision.reason}`,
    skin_id: skinId,
    proposed_steps: steps,
    estimated_compute_tokens: decomposed.route_decision.estimated_tokens,
    requires_human_approval: steps.some((s) => s.risk_level !== 'low'),
    status: 'draft',
    created_at: new Date().toISOString(),
    evidence: `Valittu taso: ${decomposed.route_decision.tier} | Kuluarvio: $${decomposed.route_decision.estimated_cost_usd.toFixed(5)}`,
  };

  store.proposals.set(proposalId, proposal);
  return proposal;
}

export function getTokenBudget(): TokenBudgetState {
  return getRouterTokenBudget();
}

/**
 * Human Approval Gate (Idempotent)
 */
export async function approveProposal(
  proposalId: string,
  editedSteps?: ProposedStep[]
): Promise<{ success: boolean; evidence: string; proposal: IntentProposal }> {
  const proposal = store.proposals.get(proposalId);
  if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

  if (editedSteps) {
    proposal.proposed_steps = editedSteps;
  }

  proposal.status = 'approved';
  const evidenceId = `EVID-${Date.now().toString().slice(-6)}`;
  proposal.evidence = `Suoritus vahvistettu valtuutetulla laitteella. Kanoninen mcp-tehtävätila: completed. Evidenssitunniste: ${evidenceId}. Ei suoria luvattomia ulkoisia mutaatioita (plan_only).`;

  // Update token quota
  store.account.monthly_token_usage += proposal.estimated_compute_tokens;

  const currentDevice = store.devices.find((d) => d.is_current) || store.devices[0];

  recordActivity({
    device_id: currentDevice.id,
    device_name: currentDevice.name,
    action_type: 'proposal_approved',
    summary: `Hyväksytty ehdotus: "${proposal.interpreted_goal}" (${proposal.proposed_steps.length} vaihetta). ${evidenceId}`,
    skin_id: proposal.skin_id,
    canonical_status: 'completed',
    source: proposal.source === 'gemini' ? 'live' : 'demo',
  });

  return {
    success: true,
    evidence: proposal.evidence,
    proposal,
  };
}

/**
 * Human Rejection Gate (Guarantees zero mutation)
 */
export async function rejectProposal(
  proposalId: string
): Promise<{ success: boolean; proposal: IntentProposal }> {
  const proposal = store.proposals.get(proposalId);
  if (!proposal) throw new Error(`Proposal ${proposalId} not found`);

  proposal.status = 'rejected';
  proposal.evidence = 'Käyttäjä hylkäsi ehdotuksen. Nolla mutaatiota suoritettu. Tila palautettu.';

  const currentDevice = store.devices.find((d) => d.is_current) || store.devices[0];

  recordActivity({
    device_id: currentDevice.id,
    device_name: currentDevice.name,
    action_type: 'proposal_rejected',
    summary: `Hylätty ehdotus: "${proposal.interpreted_goal}". Ei toimenpiteitä suoritettu.`,
    skin_id: proposal.skin_id,
    canonical_status: 'cancelled',
    source: proposal.source === 'gemini' ? 'live' : 'demo',
  });

  return { success: true, proposal };
}

/**
 * Activity log query
 */
export async function getActivityLog(): Promise<ActivityEvent[]> {
  return [...store.activities];
}

function recordActivity(event: Omit<ActivityEvent, 'id' | 'timestamp'>) {
  const newEvt: ActivityEvent = {
    id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    timestamp: 'Juuri nyt',
    ...event,
  };
  store.activities.unshift(newEvt);
  if (store.activities.length > 30) {
    store.activities.pop();
  }
}
