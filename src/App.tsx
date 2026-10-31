/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — One Account, N Devices, Many Experiences
 * Runnable mobile-first Custom Skins PWA
 */

import React, { useEffect, useState } from 'react';
import {
  AOSAccount,
  AOSDevice,
  ActivityEvent,
  ExperienceLayoutConfig,
  IntentProposal,
  ProposedStep,
  SkinManifest,
} from './types/aos';
import {
  getAccountInfo,
  getActivityLog,
  getDevices,
  getExperienceConfig,
  getSkins,
  interpretUserIntent,
  approveProposal,
  rejectProposal,
  resetExperienceConfig,
  saveExperienceConfig,
  setActiveSkin,
  switchActiveDevice,
  toggleInstallSkin,
  authorizeDevice,
} from './services/aosApi';

import { TopHeader } from './components/TopHeader';
import { DeviceSimulatorBar } from './components/DeviceSimulatorBar';
import { BottomNav, TabId } from './components/BottomNav';
import { WidgetRenderer } from './components/widgets/WidgetRenderer';
import { IntentProposalModal } from './components/IntentProposalModal';
import { SkinCustomizerModal } from './components/SkinCustomizerModal';
import { SkinLibraryView } from './components/SkinLibraryView';
import { SkinStudioView } from './components/SkinStudioView';
import { AccountDevicesView } from './components/AccountDevicesView';
import { PWAInstallButton } from './components/PWAInstallButton';

import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Wrench,
  Navigation,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink,
  Target,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function App() {
  const [account, setAccount] = useState<AOSAccount | null>(null);
  const [devices, setDevices] = useState<AOSDevice[]>([]);
  const [currentDevice, setCurrentDevice] = useState<AOSDevice | null>(null);
  const [skins, setSkins] = useState<SkinManifest[]>([]);
  const [activeSkin, setActiveSkinState] = useState<SkinManifest | null>(null);
  const [activeConfig, setActiveConfig] = useState<ExperienceLayoutConfig | null>(null);
  const [activities, setActivities] = useState<ActivityEvent[]>([]);

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabId>('home');
  const [activeViewId, setActiveViewId] = useState<string>('');

  // Modals & Intent Proposal
  const [activeProposal, setActiveProposal] = useState<IntentProposal | null>(null);
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [customizerSkin, setCustomizerSkin] = useState<SkinManifest | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    async function loadInitial() {
      const acc = await getAccountInfo();
      const devs = await getDevices();
      const allSkins = await getSkins();
      const acts = await getActivityLog();

      setAccount(acc);
      setDevices(devs);
      setCurrentDevice(devs.find((d) => d.is_current) || devs[0]);
      setSkins(allSkins);

      const active = allSkins.find((s) => s.is_active) || allSkins[0];
      setActiveSkinState(active);
      setActiveViewId(active.views[0]?.id || '');

      const cfg = await getExperienceConfig(active.skin_id);
      setActiveConfig(cfg);
      setActivities(acts);
    }
    loadInitial();
  }, []);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSelectSkin = async (skinId: string) => {
    const updated = await setActiveSkin(skinId);
    const allSkins = await getSkins();
    setSkins(allSkins);
    setActiveSkinState(updated);
    setActiveViewId(updated.views[0]?.id || '');

    const cfg = await getExperienceConfig(skinId);
    setActiveConfig(cfg);
    const acts = await getActivityLog();
    setActivities(acts);
    showToast(`Kokemus vaihdettu: ${updated.display_name}`);
  };

  const handleSelectDevice = async (deviceId: string) => {
    const updatedDevs = await switchActiveDevice(deviceId);
    setDevices(updatedDevs);
    setCurrentDevice(updatedDevs.find((d) => d.id === deviceId) || updatedDevs[0]);
    const acts = await getActivityLog();
    setActivities(acts);
    showToast(`Aktiivinen laitenäkymä vaihdettu`);
  };

  const handleAuthorizeDevice = async (name: string, type: AOSDevice['type'], platform: string) => {
    await authorizeDevice(name, type, platform);
    const devs = await getDevices();
    setDevices(devs);
    const acts = await getActivityLog();
    setActivities(acts);
    showToast(`Uusi laite valtuutettu tilille`);
  };

  const handleInterpretIntent = async (rawIntent: string) => {
    if (!activeSkin) return;
    setIsInterpreting(true);
    try {
      const proposal = await interpretUserIntent(rawIntent, activeSkin.skin_id);
      setActiveProposal(proposal);
    } catch (err) {
      console.error(err);
      showToast('Virhe intentin tulkinnassa');
    } finally {
      setIsInterpreting(false);
    }
  };

  const handleApproveProposal = async (proposalId: string, editedSteps?: ProposedStep[]) => {
    const result = await approveProposal(proposalId, editedSteps);
    setActiveProposal(result.proposal);
    const acc = await getAccountInfo();
    const acts = await getActivityLog();
    setAccount(acc);
    setActivities(acts);
    showToast('Ehdotus hyväksytty ja suoritettu!');
  };

  const handleRejectProposal = async (proposalId: string) => {
    const result = await rejectProposal(proposalId);
    setActiveProposal(result.proposal);
    const acts = await getActivityLog();
    setActivities(acts);
    showToast('Ehdotus hylätty (ei mutaatioita)');
  };

  const handleSaveExperience = async (config: ExperienceLayoutConfig) => {
    const saved = await saveExperienceConfig(config);
    setActiveConfig(saved);
    const acts = await getActivityLog();
    setActivities(acts);
    showToast(`Kokoonpano tallennettu (v${saved.version})`);
  };

  const handleResetExperience = async () => {
    if (!activeSkin) return;
    const reset = await resetExperienceConfig(activeSkin.skin_id);
    setActiveConfig(reset);
    showToast('Asettelu palautettu oletukseen');
  };

  const handleToggleInstall = async (skinId: string, install: boolean) => {
    await toggleInstallSkin(skinId, install);
    const all = await getSkins();
    setSkins(all);
    showToast(install ? 'Skin asennettu' : 'Skin poistettu');
  };

  const handleSkinCreatedAndActivated = async (newSkin: SkinManifest) => {
    const all = await getSkins();
    setSkins(all);
    await handleSelectSkin(newSkin.skin_id);
    setActiveTab('experience');
    showToast(`Uusi skin "${newSkin.display_name}" asennettu ja aktivoitu!`);
  };

  if (!account || !currentDevice || !activeSkin || !activeConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="font-display font-medium text-sm">Alustetaan AOS Product v0.1 -moottoria...</span>
        </div>
      </div>
    );
  }

  // Active view in the current skin
  const currentView = activeSkin.views.find((v) => v.id === activeViewId) || activeSkin.views[0];
  const currentViewWidgetIds =
    activeConfig.view_widget_order[currentView?.id || ''] || currentView?.widget_ids || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 md:pb-8 flex flex-col font-sans transition-colors">
      {/* 1. Interactive Multi-Device State Simulator Bar */}
      <DeviceSimulatorBar
        account={account}
        devices={devices}
        currentDevice={currentDevice}
        onSelectDevice={handleSelectDevice}
        onAuthorizeDevice={handleAuthorizeDevice}
      />

      {/* 2. Top Header Navigation Contract */}
      <TopHeader
        account={account}
        currentDevice={currentDevice}
        allDevices={devices}
        activeSkin={activeSkin}
        allSkins={skins}
        onSelectSkin={handleSelectSkin}
        onSelectDevice={handleSelectDevice}
        onOpenCustomizer={() => setCustomizerSkin(activeSkin)}
      />

      {/* Toast alert */}
      {feedbackToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white border border-slate-700 px-4 py-2.5 rounded-xl shadow-xl text-xs flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Main Responsive Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {/* ===================== TAB 1: HOME / AI PROMPT ===================== */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* Quick Hero Banner */}
            <div className="bg-gradient-to-r from-indigo-900/90 via-slate-900 to-slate-900 rounded-3xl p-5 sm:p-7 text-white border border-slate-800 shadow-sm relative overflow-hidden">
              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-indigo-300 mb-2">
                  <span>Yksi tili</span>
                  <span aria-hidden="true">·</span>
                  <span>{devices.length} valtuutettua laitetta</span>
                  <span aria-hidden="true">·</span>
                  <span>Hallittu AOS Engine</span>
                </div>
                <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
                  Mitä haluat AOS:n tekevän tänään?
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Anna toive luonnollisella kielellä. AOS tulkitsee pyynnön, tarkistaa tilin ja laitteen
                  oikeudet, laatii rajatun suoritusehdotuksen (plan_only) ja odottaa hyväksyntääsi.
                </p>

                {/* Skin quick launch buttons */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Esiasetetut kokemukset:</span>
                  {skins
                    .filter((s) => s.installed)
                    .map((s) => (
                      <button
                        key={s.skin_id}
                        onClick={() => handleSelectSkin(s.skin_id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                          s.skin_id === activeSkin.skin_id
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: s.accent_color }}
                        />
                        <span>{s.display_name}</span>
                        {s.kind === 'demo' && (
                          <span className="text-[10px] uppercase font-mono px-1 rounded bg-black/30 text-slate-300">
                            Demo
                          </span>
                        )}
                      </button>
                    ))}
                </div>
              </div>
            </div>

            {/* Welcoming AI Intent Composer */}
            <WidgetRenderer
              widget={{
                id: 'home-composer',
                component_type: 'intent-composer',
                title: `AOS Avustaja — Aktiivinen kokemus: ${activeSkin.display_name}`,
                data_source: 'aos:proposals',
              }}
              skinId={activeSkin.skin_id}
              onInterpretIntent={handleInterpretIntent}
              isInterpreting={isInterpreting}
            />

            {/* "Continue" active card & Enabled tools summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Continue Card */}
              <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Jatka siitä mihin jäit
                    </span>
                    <span className="font-mono text-[11px]">DMS Context Link</span>
                  </div>
                  <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mt-1">
                    {activeSkin.skin_id === 'field-service-demo'
                      ? 'Päivän kolme lukkosepän huoltotehtävää odottaa suoritusta'
                      : activeSkin.skin_id === 'driver-demo'
                      ? 'Seuraava toimitus: Itämerentorni (ETA 10:40)'
                      : 'Q4 Huoltotyön luotettavuus (84 % toteutuma)'}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                    {activeSkin.skin_id === 'field-service-demo'
                      ? 'As Oy Tapiolan Tammiston CY062-pesän vaihto aikataulutettu klo 08:30. Osat valmiina autovarastossa.'
                      : activeSkin.skin_id === 'driver-demo'
                      ? 'AOS suosittelee 20 min lataustaukoa Keimolanportissa ennen iltapäivän huoltokeikkaa.'
                      : 'Tavoitepuu synkronoitu laitteiden välillä. Ei avoimia virhetiloja.'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Päivitetty 10 min sitten
                  </span>
                  <button
                    onClick={() => setActiveTab('experience')}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    <span>Avaa näkymä</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Your Tools Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
                  Käytössä olevat työkalut
                </div>
                <div className="space-y-2 text-xs">
                  {activeSkin.widgets.map((w) => (
                    <div
                      key={w.id}
                      className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-750 flex items-center justify-between"
                    >
                      <div className="truncate pr-2">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {w.title}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {w.component_type}
                        </div>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: ACTIVE SKIN EXPERIENCE ===================== */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* View Selector Header */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {activeConfig.display_name}
                  </h2>
                  <span
                    className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${activeSkin.accent_color}20`,
                      color: activeSkin.accent_color,
                    }}
                  >
                    {activeSkin.kind}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeSkin.tagline} · Asetteluversio v{activeConfig.version}
                </div>
              </div>

              {/* Sub-view navigation tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-x-auto text-xs font-semibold">
                {activeSkin.views.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveViewId(v.id)}
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                      activeViewId === v.id
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {v.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Render Widgets in Saved Order */}
            <div className="space-y-4">
              {currentViewWidgetIds.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
                  Ei aktiivisia widgettejä tässä näkymässä. Avaa Muokkaa-valikko lisätäksesi komponentteja.
                </div>
              ) : (
                currentViewWidgetIds.map((widgetId) => {
                  const widgetDef = activeSkin.widgets.find((w) => w.id === widgetId);
                  if (!widgetDef) return null;
                  return (
                    <WidgetRenderer
                      key={widgetId}
                      widget={widgetDef}
                      skinId={activeSkin.skin_id}
                      onInterpretIntent={handleInterpretIntent}
                      onOpenIntentWithText={(text) => handleInterpretIntent(text)}
                      isInterpreting={isInterpreting}
                    />
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ===================== TAB 3: SKIN LIBRARY ===================== */}
        {activeTab === 'library' && (
          <SkinLibraryView
            skins={skins}
            activeSkin={activeSkin}
            onActivateSkin={handleSelectSkin}
            onToggleInstall={handleToggleInstall}
            onOpenCustomizer={(s) => setCustomizerSkin(s)}
            onOpenStudio={() => setActiveTab('studio')}
          />
        )}

        {/* ===================== TAB 4: UI & SKIN STUDIO ===================== */}
        {activeTab === 'studio' && (
          <SkinStudioView
            onSkinCreatedAndActivated={handleSkinCreatedAndActivated}
            onCancel={() => setActiveTab('library')}
          />
        )}

        {/* ===================== TAB 5: ACCOUNT, DEVICES & ACTIVITY ===================== */}
        {activeTab === 'activity' && (
          <AccountDevicesView
            account={account}
            devices={devices}
            currentDevice={currentDevice}
            activities={activities}
            onSelectDevice={handleSelectDevice}
          />
        )}
      </main>

      {/* 3. Bottom Ergonomic Navigation Bar for Mobile */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        activeSkin={activeSkin}
      />

      {/* 4. Intent Proposal Modal (Human Approval Gate) */}
      {activeProposal && (
        <IntentProposalModal
          proposal={activeProposal}
          onApprove={handleApproveProposal}
          onReject={handleRejectProposal}
          onClose={() => setActiveProposal(null)}
        />
      )}

      {/* 5. Skin Customizer Modal (Stateful Save/Cancel) */}
      {customizerSkin && (
        <SkinCustomizerModal
          skin={customizerSkin}
          currentConfig={activeConfig}
          onSave={handleSaveExperience}
          onReset={handleResetExperience}
          onClose={() => setCustomizerSkin(null)}
        />
      )}
    </div>
  );
}
