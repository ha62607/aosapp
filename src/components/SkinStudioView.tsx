/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS SkinStudioView — Interactive UI & Skin Design Suite
 * Google Stitch / AI Studio Design-to-Code Workflow
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  Building,
  Navigation,
  Package,
  Layers,
  Palette,
  Eye,
  SlidersHorizontal,
  FileCode,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Monitor,
  Zap,
  Plus,
  Trash2,
} from 'lucide-react';
import { SkinManifest, WidgetDefinition } from '../types/aos';
import { generateSkinWithAI, createCustomSkin } from '../services/aosApi';
import { WidgetRenderer } from './widgets/WidgetRenderer';

interface SkinStudioViewProps {
  onSkinCreatedAndActivated: (skin: SkinManifest) => void;
  onCancel: () => void;
}

export const SkinStudioView: React.FC<SkinStudioViewProps> = ({
  onSkinCreatedAndActivated,
  onCancel,
}) => {
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDeviceMode, setPreviewDeviceMode] = useState<'mobile' | 'desktop'>('mobile');
  const [showJsonManifest, setShowJsonManifest] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Current working draft manifest
  const [draftSkin, setDraftSkin] = useState<SkinManifest>({
    schema_version: 'aos.skin.v0.1',
    skin_id: 'skin_custom_studio_1',
    display_name: 'LVI- ja Kylmälaitehuolto',
    version: '0.1.0',
    kind: 'production',
    description: 'Lämpö-, vesi- ja ilmastointiasentajien kenttätyöskentelyn operatiivinen työtila.',
    tagline: 'LVI-teknikon erikoistunut työpöytä',
    icon: 'Wrench',
    primary_color: '#0284c7',
    accent_color: '#38bdf8',
    required_capabilities: ['ai.chat', 'tasks.plan_only'],
    requested_permissions: ['jobs.sample.read', 'hvac.telemetry'],
    installed: true,
    is_active: false,
    views: [
      {
        id: 'overview',
        title: 'Huoltotyöt',
        icon: 'Wrench',
        widget_ids: ['hvac-metrics', 'hvac-jobs'],
      },
      {
        id: 'plan',
        title: 'Uusi suunnitelma',
        icon: 'FilePlus',
        widget_ids: ['hvac-composer'],
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
        title: 'Valmistele painetestaus- tai huoltosuunnitelma',
        data_source: 'aos:proposals',
      },
    ],
  });

  const handleGenerate = async (queryText?: string) => {
    const text = queryText || promptInput;
    if (!text.trim() || isGenerating) return;

    setIsGenerating(true);
    try {
      const generated = await generateSkinWithAI(text);
      setDraftSkin(generated);
      setSuccessToast(`Uusi konsepti luotu: ${generated.display_name}`);
      setTimeout(() => setSuccessToast(null), 3000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInstallAndActivate = async () => {
    const installed = await createCustomSkin(draftSkin);
    onSkinCreatedAndActivated(installed);
  };

  const colorPresets = [
    { name: 'Sky (LVI & Vesi)', primary: '#0284c7', accent: '#38bdf8' },
    { name: 'Emerald (Kiinteistöt & Ekologia)', primary: '#059669', accent: '#34d399' },
    { name: 'Indigo (Yleisavustaja)', primary: '#4f46e5', accent: '#818cf8' },
    { name: 'Amber (Kuljetus & Logistiikka)', primary: '#d97706', accent: '#fbbf24' },
    { name: 'Rose (Terveydenhuolto & Hoiva)', primary: '#e11d48', accent: '#fb7185' },
    { name: 'Slate (Teollisuus & Insinööri)', primary: '#334155', accent: '#94a3b8' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner explaining Stitch & AI Studio */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 text-white shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Google Stitch & AI Studio — UI-suunnittelutyöpöytä</span>
          </div>

          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Suunnittele ja testaa uusia toimialaskinejä
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            <strong>Google Stitch</strong> toimii ideointi- ja luonnostelutyökaluna (Design-to-Code),
            kun taas <strong>Google AI Studio</strong> muuttaa luonnokset välittömästi ajettavaksi,
            mobiili-first PWA -koodiksi. Voit luonnostella uuden skinin tekstikuvauksella, hienosäätää
            värit ja widgetit, ja asentaa sen suoraan tilillesi.
          </p>

          {/* Quick concept templates */}
          <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Kokeile valmiita konsepteja:</span>
            {[
              'LVI- ja kylmälaiteasennus',
              'Kiinteistöhuolto ja isännöinti',
              'Sähköurakointi ja mittaukset',
            ].map((concept, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPromptInput(concept);
                  handleGenerate(concept);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                {concept}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successToast && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Main Studio Grid: Controls on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual & Prompt Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Prompt Generator Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2 font-display font-bold text-sm text-slate-900 dark:text-white">
              <Zap className="w-4 h-4 text-indigo-500" />
              <span>1. Ideoi uusi skin tekoälyllä (Stitch-periaate)</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Kuvaile toimiala, käyttäjärooli tai tarvittavat työt:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="esim. 'Kylmälaitehuolto ja lämpöpumppuasennus'..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => handleGenerate()}
                disabled={!promptInput.trim() || isGenerating}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
              >
                {isGenerating ? 'Luodaan...' : 'Luo luonnos'}
              </button>
            </div>
          </div>

          {/* Visual Customizer Controls */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 text-xs">
            <div className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">
              <span>2. Hienosäädä brändiä ja sisältöä</span>
              <button
                onClick={() => setShowJsonManifest(!showJsonManifest)}
                className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:underline"
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{showJsonManifest ? 'Piilota JSON' : 'Näytä JSON'}</span>
              </button>
            </div>

            {/* Title & Tagline */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Kokemuksen nimi
              </label>
              <input
                type="text"
                value={draftSkin.display_name}
                onChange={(e) => setDraftSkin({ ...draftSkin, display_name: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
                Lyhyt kuvaus / Tagline
              </label>
              <input
                type="text"
                value={draftSkin.tagline}
                onChange={(e) => setDraftSkin({ ...draftSkin, tagline: e.target.value })}
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            {/* Color Presets */}
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
                Väriteema ja korostus
              </label>
              <div className="grid grid-cols-2 gap-2">
                {colorPresets.map((cp, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setDraftSkin({
                        ...draftSkin,
                        primary_color: cp.primary,
                        accent_color: cp.accent,
                      })
                    }
                    className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                      draftSkin.primary_color === cp.primary
                        ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: cp.accent }}
                    />
                    <span className="truncate text-[11px] font-medium text-slate-700 dark:text-slate-300">
                      {cp.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* JSON Manifest Inspection */}
            {showJsonManifest && (
              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 max-h-48">
                <pre>{JSON.stringify(draftSkin, null, 2)}</pre>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-2 text-slate-500 hover:text-slate-700 text-xs"
              >
                Palaa takaisin
              </button>

              <button
                type="button"
                onClick={handleInstallAndActivate}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-sm transition-all"
              >
                <span>Asenna & Ota käyttöön</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Interactive Sandbox Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Sandbox Controls Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span className="font-display font-semibold text-xs text-slate-900 dark:text-white">
                Interaktiivinen Sandbox-esikatselu
              </span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
              <button
                onClick={() => setPreviewDeviceMode('mobile')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  previewDeviceMode === 'mobile'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Puhelin (390px)</span>
              </button>
              <button
                onClick={() => setPreviewDeviceMode('desktop')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded transition-colors ${
                  previewDeviceMode === 'desktop'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Työpöytä</span>
              </button>
            </div>
          </div>

          {/* Sandbox Canvas */}
          <div
            className={`mx-auto bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-3xl p-4 transition-all overflow-hidden ${
              previewDeviceMode === 'mobile' ? 'max-w-md shadow-2xl ring-4 ring-slate-800/10' : 'w-full shadow-sm'
            }`}
          >
            {/* Mock device status bar in mobile mode */}
            {previewDeviceMode === 'mobile' && (
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-3 px-1 border-b border-slate-200 dark:border-slate-800 pb-1.5">
                <span>09:41</span>
                <span>AOS v0.1 · 5G</span>
              </div>
            )}

            {/* Rendered Mock Top Header for the Skin */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 mb-3 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: draftSkin.accent_color }}
                  />
                  <span className="font-display font-bold text-sm text-slate-900 dark:text-white">
                    {draftSkin.display_name}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">{draftSkin.tagline}</div>
              </div>

              <div className="flex items-center gap-1 text-[11px]">
                {draftSkin.views.map((v, i) => (
                  <span
                    key={v.id}
                    className={`px-2 py-0.5 rounded ${
                      i === 0
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {v.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Render Actual Widgets */}
            <div className="space-y-3">
              {draftSkin.widgets.map((widget) => (
                <WidgetRenderer
                  key={widget.id}
                  widget={widget}
                  skinId={draftSkin.skin_id}
                  onInterpretIntent={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
