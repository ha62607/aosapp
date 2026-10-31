/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS SkinLibraryView — Packaged Working Experiences (Skins) Explorer
 * Demonstrates: One AOS Engine serving many domain experiences
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  Navigation,
  Building,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Download,
  Trash2,
} from 'lucide-react';
import { SkinManifest } from '../types/aos';

interface SkinLibraryViewProps {
  skins: SkinManifest[];
  activeSkin: SkinManifest;
  onActivateSkin: (skinId: string) => void;
  onToggleInstall: (skinId: string, install: boolean) => void;
  onOpenCustomizer: (skin: SkinManifest) => void;
  onOpenStudio?: () => void;
}

export const SkinLibraryView: React.FC<SkinLibraryViewProps> = ({
  skins,
  activeSkin,
  onActivateSkin,
  onToggleInstall,
  onOpenCustomizer,
  onOpenStudio,
}) => {
  const [filter, setFilter] = useState<'all' | 'installed' | 'demo'>('all');

  const filteredSkins = skins.filter((skin) => {
    if (filter === 'installed') return skin.installed;
    if (filter === 'demo') return skin.kind === 'demo';
    return true;
  });

  const getSkinIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-teal-500" />;
      case 'Navigation':
        return <Navigation className="w-5 h-5 text-orange-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                Skin Library & Pakatut kokemukset
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              *Skin* ei ole vain väriteema, vaan pakattu toimialakokemus: käyttötarkoituksen mukainen
              sanasto, työnkulut, widgetit, luvat ja rajapinnat. Kaikki jakavat saman AOS Engine -moottorin.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onOpenStudio && (
              <button
                onClick={onOpenStudio}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Avaa Skin Studio</span>
              </button>
            )}

            {/* Segmented Filter */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === 'all'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Kaikki ({skins.length})
              </button>
              <button
                onClick={() => setFilter('installed')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === 'installed'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Asennetut ({skins.filter((s) => s.installed).length})
              </button>
              <button
                onClick={() => setFilter('demo')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  filter === 'demo'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Demot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Skins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkins.map((skin) => {
          const isActive = skin.skin_id === activeSkin.skin_id;

          return (
            <div
              key={skin.skin_id}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 transition-all shadow-xs flex flex-col justify-between ${
                isActive
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div>
                {/* Title & Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${skin.accent_color}15`,
                        borderColor: `${skin.accent_color}40`,
                      }}
                    >
                      {getSkinIcon(skin.icon)}
                    </div>

                    <div>
                      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{skin.display_name}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          v{skin.version}
                        </span>
                      </h3>
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {skin.tagline}
                      </div>
                    </div>
                  </div>

                  {isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Aktiivinen</span>
                    </span>
                  ) : skin.installed ? (
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      Asennettu
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400">Saatavilla</span>
                  )}
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed">
                  {skin.description}
                </p>

                {/* Capabilities and Permissions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-medium">Vaaditut kyvykkyydet: </span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">
                      {skin.required_capabilities.join(', ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Pyydetyt luvat: </span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">
                      {skin.requested_permissions.join(', ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-medium">Sisältyvät näkymät: </span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {skin.views.map((v) => v.title).join(' · ')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onOpenCustomizer(skin)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Muokkaa</span>
                </button>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <button
                      onClick={() => onActivateSkin(skin.skin_id)}
                      className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Ota käyttöön</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
