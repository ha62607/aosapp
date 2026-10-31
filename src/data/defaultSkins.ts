/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — Official Skins Manifest Registry
 */

import { SkinManifest } from '../types/aos';

export const DEFAULT_SKINS: SkinManifest[] = [
  {
    schema_version: 'aos.skin.v0.1',
    skin_id: 'everyday-assistant',
    display_name: 'AI Studio Hub',
    version: '1.0.0',
    kind: 'production',
    description: 'Päivittäinen operatiivinen työtila: DMS-tavoitteet, nopea intent-säveltäjä ja widget-kooste.',
    tagline: 'Päivittäinen apuri & tavoitehallinta',
    icon: 'Sparkles',
    primary_color: '#4f46e5', // indigo
    accent_color: '#6366f1',
    required_capabilities: ['ai.chat', 'notes.storage', 'tasks.plan_only'],
    requested_permissions: ['profile.read', 'notes.readwrite'],
    installed: true,
    is_active: true,
    views: [
      {
        id: 'home',
        title: 'Kooste',
        icon: 'LayoutDashboard',
        widget_ids: ['quick-intent', 'today-metrics', 'pinned-notes'],
      },
      {
        id: 'goals',
        title: 'Tavoitteet',
        icon: 'Target',
        widget_ids: ['dms-goal-tree', 'quick-intent'],
      },
      {
        id: 'notes',
        title: 'Muistiinpanot',
        icon: 'FileText',
        widget_ids: ['pinned-notes'],
      },
    ],
    widgets: [
      {
        id: 'quick-intent',
        component_type: 'intent-composer',
        title: 'Mitä haluat AOS:n tekevän tänään?',
        data_source: 'aos:proposals',
      },
      {
        id: 'today-metrics',
        component_type: 'metric-group',
        title: 'Päivän tila & suoritukset',
        data_source: 'demo:general',
      },
      {
        id: 'pinned-notes',
        component_type: 'notes-board',
        title: 'Aktiiviset muistiinpanot & tavoitteet',
        data_source: 'demo:general',
      },
      {
        id: 'dms-goal-tree',
        component_type: 'record-list',
        title: 'DMS Tavoitepuu (Goal Tree)',
        data_source: 'dms:goals',
      },
    ],
  },
  {
    schema_version: 'aos.skin.v0.1',
    skin_id: 'etsin-forager',
    display_name: 'Etsin (Sienet & Marjat)',
    version: '1.0.0',
    kind: 'production',
    description: 'AI-maastoapuri ulkoiluun: GPS, biotooppitutka ("150m länteen kuusikkoon"), kamera aktiivi/passiivitilalla ja pika-arvio lajin syötävyydestä.',
    tagline: 'Maasto-opas, lajitunnistus & saaliskartta',
    icon: 'Compass',
    primary_color: '#059669', // emerald green
    accent_color: '#10b981',
    required_capabilities: ['camera.vision', 'sensors.location', 'spatial.biotope'],
    requested_permissions: ['camera', 'geolocation'],
    installed: true,
    is_active: false,
    views: [
      {
        id: 'camera-view',
        title: 'Kamera & Etsin',
        icon: 'Camera',
        widget_ids: ['etsin-intent', 'forager-metrics'],
      },
      {
        id: 'radar-view',
        title: 'Maastotutka',
        icon: 'Compass',
        widget_ids: ['biotope-spots', 'forager-metrics'],
      },
      {
        id: 'logbook-view',
        title: 'Saalispäiväkirja',
        icon: 'Bookmark',
        widget_ids: ['recent-catches'],
      },
    ],
    widgets: [
      {
        id: 'etsin-intent',
        component_type: 'intent-composer',
        title: 'Etsin Kamera & Pikatunnistus (Aktiivi / Passiivi)',
        data_source: 'aos:proposals',
      },
      {
        id: 'forager-metrics',
        component_type: 'metric-group',
        title: 'Maastotilanne & Sijainti',
        data_source: 'demo:general',
      },
      {
        id: 'biotope-spots',
        component_type: 'record-list',
        title: 'Potentiaaliset sienipaikat 200m säteellä',
        data_source: 'dms:goals',
      },
      {
        id: 'recent-catches',
        component_type: 'record-list',
        title: 'Tallennetut saalispisteet',
        data_source: 'dms:goals',
      },
    ],
  },
  {
    schema_version: 'aos.skin.v0.1',
    skin_id: 'voice-os',
    display_name: 'Voice OS (Janet & Michelle)',
    version: '1.0.0',
    kind: 'production',
    description: 'Hands-free reaaliaikainen puheyhteys ilman kuluttajarajoituksia. Gemini Multimodal Live API, WebRTC-puhelu ja Domain/Area/Goal -reititys.',
    tagline: 'Reaaliaikainen sparrauspuhelu & ääniohjaus',
    icon: 'Mic',
    primary_color: '#8b5cf6', // purple
    accent_color: '#a78bfa',
    required_capabilities: ['audio.webrtc', 'voice.stream', 'workspaces.route'],
    requested_permissions: ['microphone'],
    installed: true,
    is_active: false,
    views: [
      {
        id: 'voice-call',
        title: 'Puhelu',
        icon: 'PhoneCall',
        widget_ids: ['voice-intent', 'voice-metrics'],
      },
      {
        id: 'assistants',
        title: 'Assistentit',
        icon: 'Users',
        widget_ids: ['voice-assistants-list'],
      },
      {
        id: 'topics',
        title: 'Aiheet & Muistiinpanot',
        icon: 'MessageSquare',
        widget_ids: ['pinned-notes'],
      },
    ],
    widgets: [
      {
        id: 'voice-intent',
        component_type: 'intent-composer',
        title: 'Käynnistä puhelu (Janet / Michelle) tai sanele',
        data_source: 'aos:proposals',
      },
      {
        id: 'voice-metrics',
        component_type: 'metric-group',
        title: 'Äänitilan & WebRTC-yhteyden tila',
        data_source: 'demo:general',
      },
      {
        id: 'voice-assistants-list',
        component_type: 'record-list',
        title: 'Assistentit ja työtilat (Domain / Project / Goal)',
        data_source: 'dms:goals',
      },
    ],
  },
  {
    schema_version: 'aos.skin.v0.1',
    skin_id: 'antigravity-mobile',
    display_name: 'Antigravity Mobile (DevPC)',
    version: '1.0.0',
    kind: 'production',
    description: 'devpc:n ja prodpc:n projektien mobiiliohjaus: tehtävien hyväksyntä, live-terminaali, git-tila ja systemd-palveluiden uudelleenkäynnistys.',
    tagline: 'DevPC & etäagenttien mobiilikomento',
    icon: 'Terminal',
    primary_color: '#0284c7', // sky blue
    accent_color: '#38bdf8',
    required_capabilities: ['remote.ssh', 'tasks.plan_only', 'remote.systemd'],
    requested_permissions: ['remote.exec', 'fleet.read'],
    installed: true,
    is_active: false,
    views: [
      {
        id: 'fleet-overview',
        title: 'Koneet & Projektit',
        icon: 'Server',
        widget_ids: ['fleet-metrics', 'remote-projects-list'],
      },
      {
        id: 'intent-approvals',
        title: 'Agentti-chat',
        icon: 'MessageSquare',
        widget_ids: ['devpc-intent'],
      },
      {
        id: 'services',
        title: 'Palvelut',
        icon: 'Activity',
        widget_ids: ['systemd-services-list'],
      },
    ],
    widgets: [
      {
        id: 'devpc-intent',
        component_type: 'intent-composer',
        title: 'Anna agentille tehtävä devpc:llä',
        data_source: 'aos:proposals',
      },
      {
        id: 'fleet-metrics',
        component_type: 'metric-group',
        title: 'devpc (192.168.68.133) & prodpc tila',
        data_source: 'demo:general',
      },
      {
        id: 'remote-projects-list',
        component_type: 'record-list',
        title: 'Aktiiviset projektit (~/projects)',
        data_source: 'dms:goals',
      },
      {
        id: 'systemd-services-list',
        component_type: 'record-list',
        title: 'Palvelut (voice-infra.service, caddy)',
        data_source: 'dms:goals',
      },
    ],
  },
];
