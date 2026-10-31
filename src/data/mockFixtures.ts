/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — Realistic Mock Fixtures (Explicitly Tagged DEMO)
 */

import { AOSAccount, AOSDevice, ActivityEvent } from '../types/aos';

export const INITIAL_ACCOUNT: AOSAccount = {
  id: 'acc_hannu_primus72',
  name: 'Hannu (Primus72)',
  email: 'hannu@primus72.com',
  tenant_id: 'tenant_primus_eu1',
  plan: 'Professional',
  status: 'active',
  created_at: '2026-09-01T08:00:00Z',
  monthly_token_usage: 14250,
  monthly_token_limit: 100000,
};

export const INITIAL_DEVICES: AOSDevice[] = [
  {
    id: 'dev_phone_9pro',
    name: 'Pixel 9 Pro (Tämä laite)',
    type: 'mobile_phone',
    platform: 'Android PWA / Chrome 132',
    authorized_at: '2026-10-15T09:30:00Z',
    last_seen: 'Juuri nyt',
    status: 'active',
    is_current: true,
    permitted_capabilities: ['ai.chat', 'tasks.plan_only', 'notes.storage', 'jobs.sample.read'],
  },
  {
    id: 'dev_tablet_air',
    name: 'iPad Air 11" (Huoltoauto / Toimisto)',
    type: 'tablet',
    platform: 'iPadOS PWA / Safari',
    authorized_at: '2026-10-18T14:10:00Z',
    last_seen: '12 min sitten',
    status: 'standby',
    is_current: false,
    permitted_capabilities: ['ai.chat', 'tasks.plan_only', 'notes.storage', 'jobs.sample.read', 'inventory.sample.read'],
  },
  {
    id: 'dev_vehicle_screen',
    name: 'Ajoneuvonäyttö (Transporter T6)',
    type: 'vehicle_display',
    platform: 'Android Automotive OS 14',
    authorized_at: '2026-10-20T07:45:00Z',
    last_seen: '23 min sitten',
    status: 'standby',
    is_current: false,
    permitted_capabilities: ['ai.chat', 'route.sample.read', 'telemetry.safe'],
  },
  {
    id: 'dev_macbook_workstation',
    name: 'MacBook Pro (Pääteasema)',
    type: 'workstation',
    platform: 'macOS Sonoma / Edge',
    authorized_at: '2026-10-01T10:00:00Z',
    last_seen: '3 tuntia sitten',
    status: 'standby',
    is_current: false,
    permitted_capabilities: ['ai.chat', 'tasks.plan_only', 'admin.experiences', 'notes.readwrite'],
  },
];

export interface FieldServiceJob {
  id: string;
  customer: string;
  address: string;
  time_window: string;
  type: string;
  description: string;
  priority: 'Normaali' | 'Kiireellinen' | 'Kriittinen';
  status: 'Aikataulutettu' | 'Käynnissä' | 'Valmis';
  required_parts: string[];
}

export const INITIAL_FIELD_JOBS: FieldServiceJob[] = [
  {
    id: 'job-101',
    customer: 'As Oy Tapiolan Tammisto',
    address: 'Metsänneidonkuja 6, Espoo',
    time_window: '08:30 – 10:00',
    type: 'Lukituksen sarjoitus',
    description: 'B-rapun porrasoven Abloy Protec2 -pesän vaihto ja 12 avaimen luovutus isännöitsijälle.',
    priority: 'Normaali',
    status: 'Aikataulutettu',
    required_parts: ['Abloy Protec2 CY062', 'Avainaihio x12', 'Turvaruuvit M5'],
  },
  {
    id: 'job-102',
    customer: 'Kiinteistö Oy Itämerentorni',
    address: 'Itämerenkatu 11, Helsinki',
    time_window: '10:45 – 12:30',
    type: 'Älylukkoasennus',
    description: 'Neuvotteluhuoneen lasioven Yale Doorman L3S -asennus ja yhdistäminen kulunvalvontaan.',
    priority: 'Kiireellinen',
    status: 'Aikataulutettu',
    required_parts: ['Yale Doorman L3S Chrome', 'Vastakappale 1487-1', 'Akkusarja AA'],
  },
  {
    id: 'job-103',
    customer: 'Logistiikkahalli Kehä III',
    address: 'Tiilitie 4, Vantaa',
    time_window: '13:30 – 15:15',
    type: 'Ovensulkimen korjaus',
    description: 'Palo-oven Dormakaba TS 93 -hydrauliikan tarkastus, öljyvuodon korjaus ja säätö.',
    priority: 'Normaali',
    status: 'Aikataulutettu',
    required_parts: ['Dormakaba TS 93 Liukuvarsi', 'Hydrauliikkatiivistesarja'],
  },
];

export interface DriverStop {
  id: string;
  stop_number: number;
  location_name: string;
  address: string;
  estimated_arrival: string;
  stop_type: 'Toimitus' | 'Nouto' | 'Varikko / Huolto';
  instructions: string;
  completed: boolean;
}

export const INITIAL_DRIVER_STOPS: DriverStop[] = [
  {
    id: 'stop-01',
    stop_number: 1,
    location_name: 'Päävarasto Lauttasaari',
    address: 'Vattuniemenkatu 18, Helsinki',
    estimated_arrival: '08:00',
    stop_type: 'Nouto',
    instructions: 'Lastauslaituri 3. Ota keikkojen 101-103 varaosalaatikot.',
    completed: true,
  },
  {
    id: 'stop-02',
    stop_number: 2,
    location_name: 'As Oy Tapiolan Tammisto',
    address: 'Metsänneidonkuja 6, Espoo',
    estimated_arrival: '08:25',
    stop_type: 'Toimitus',
    instructions: 'Soita huoltomiehelle p. 040 123 4567 portin avaamiseksi.',
    completed: false,
  },
  {
    id: 'stop-03',
    stop_number: 3,
    location_name: 'Itämerentorni',
    address: 'Itämerenkatu 11, Helsinki',
    estimated_arrival: '10:40',
    stop_type: 'Toimitus',
    instructions: 'Pysäköi huoltoruutuun C2 talon takana. Ilmoittaudu aulaan.',
    completed: false,
  },
  {
    id: 'stop-04',
    stop_number: 4,
    location_name: 'ABC Keimolanportti (Suositus)',
    address: 'Keimolantie 1, Vantaa',
    estimated_arrival: '12:45',
    stop_type: 'Varikko / Huolto',
    instructions: 'AOS:n ehdottama 20 min lataus- ja lounastauko ennen iltapäivän huoltoa.',
    completed: false,
  },
];

export const INITIAL_NOTES = [
  {
    id: 'note-1',
    title: 'Kehä III huoltoreitin optimointi',
    content: 'Kehä I ruuhkautuu klo 15 jälkeen. Siirrä Tiilitien keikka alkamaan viimeistään klo 13:30.',
    category: 'Reitti & Logistiikka',
    date: 'Tänään 07:45',
  },
  {
    id: 'note-2',
    title: 'Abloy Sento varaosatilaus',
    content: 'Tukusta tilattava 10 kpl CY062 -sylintereitä ensi viikon kiinteistösarjoituksiin.',
    category: 'Hankinnat',
    date: 'Eilen 16:20',
  },
];

export const INITIAL_DMS_GOALS = [
  {
    id: 'goal-root-1',
    title: 'Lokakuun huoltotoiminnan luotettavuus (98 % SLA)',
    progress: 84,
    status: 'active',
    provenance: 'DMS://goals/2026-q4/field-operations',
    children: [
      { id: 'goal-sub-1', title: 'Suorita tänään 3 kriittistä lukituskeikkaa', progress: 33, status: 'in_progress' },
      { id: 'goal-sub-2', title: 'Pidä huoltoauton osavaraston puutosaste alle 5 %', progress: 95, status: 'on_track' },
      { id: 'goal-sub-3', title: 'Minimoi ajonaikaiset tyhjäkäyntikilometrit', progress: 78, status: 'on_track' },
    ],
  },
];

export const INITIAL_ACTIVITIES: ActivityEvent[] = [
  {
    id: 'act-1',
    timestamp: '10 min sitten',
    device_id: 'dev_phone_9pro',
    device_name: 'Pixel 9 Pro',
    action_type: 'device_switched',
    summary: 'Laite valtuutettu ja synkronoitu AOS-tilille hannu@primus72.com',
    skin_id: 'everyday-assistant',
    canonical_status: 'completed',
    source: 'live',
  },
  {
    id: 'act-2',
    timestamp: '25 min sitten',
    device_id: 'dev_tablet_air',
    device_name: 'iPad Air 11"',
    action_type: 'proposal_approved',
    summary: 'Aamun huoltotöiden varaosavarauksen plan_only hyväksytty',
    skin_id: 'field-service-demo',
    canonical_status: 'completed',
    source: 'demo',
  },
  {
    id: 'act-3',
    timestamp: '1 h sitten',
    device_id: 'dev_macbook_workstation',
    device_name: 'MacBook Pro',
    action_type: 'skin_customized',
    summary: 'Field Service -näkymän widget-järjestys tallennettu palvelimelle',
    skin_id: 'field-service-demo',
    canonical_status: 'completed',
    source: 'live',
  },
];
