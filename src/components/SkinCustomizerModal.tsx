/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS SkinCustomizerModal — Stateful Experience Layout Customizer
 * Enforces: Declarative JSON layout changes only, Save/Cancel, Revert to default
 */

import React, { useState } from 'react';
import {
  SlidersHorizontal,
  MoveUp,
  MoveDown,
  Eye,
  EyeOff,
  RotateCcw,
  Save,
  X,
  Sparkles,
  CheckCircle,
  FileCode,
} from 'lucide-react';
import { ExperienceLayoutConfig, SkinManifest, WidgetDefinition } from '../types/aos';

interface SkinCustomizerModalProps {
  skin: SkinManifest;
  currentConfig: ExperienceLayoutConfig;
  onSave: (config: ExperienceLayoutConfig) => Promise<void>;
  onReset: () => Promise<void>;
  onClose: () => void;
}

export const SkinCustomizerModal: React.FC<SkinCustomizerModalProps> = ({
  skin,
  currentConfig,
  onSave,
  onReset,
  onClose,
}) => {
  const [activeViewId, setActiveViewId] = useState(skin.views[0]?.id || 'overview');
  const [displayName, setDisplayName] = useState(currentConfig.display_name || skin.display_name);
  const [orderMap, setOrderMap] = useState<Record<string, string[]>>({
    ...currentConfig.view_widget_order,
  });
  const [showJsonManifest, setShowJsonManifest] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeWidgetIds = orderMap[activeViewId] || skin.views.find((v) => v.id === activeViewId)?.widget_ids || [];

  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const list = [...activeWidgetIds];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return;

    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setOrderMap({
      ...orderMap,
      [activeViewId]: list,
    });
  };

  const removeWidgetFromView = (widgetId: string) => {
    const list = activeWidgetIds.filter((id) => id !== widgetId);
    setOrderMap({
      ...orderMap,
      [activeViewId]: list,
    });
  };

  const addWidgetToView = (widgetId: string) => {
    if (activeWidgetIds.includes(widgetId)) return;
    setOrderMap({
      ...orderMap,
      [activeViewId]: [...activeWidgetIds, widgetId],
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        ...currentConfig,
        display_name: displayName,
        view_widget_order: orderMap,
        updated_at: new Date().toISOString(),
      });
      setToastMessage('Asettelu tallennettu onnistuneesti!');
      setTimeout(() => {
        onClose();
      }, 700);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    await onReset();
    setDisplayName(skin.display_name);
    const defaultOrder: Record<string, string[]> = {};
    skin.views.forEach((v) => {
      defaultOrder[v.id] = [...v.widget_ids];
    });
    setOrderMap(defaultOrder);
    setToastMessage('Palautettu oletusasetuksiin!');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const getWidgetInfo = (id: string): WidgetDefinition | undefined => {
    return skin.widgets.find((w) => w.id === id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
            <div>
              <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
                Mukauta kokemusta: {skin.display_name}
              </h2>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                Deklaratiivinen asettelu · Versio {currentConfig.version}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowJsonManifest(!showJsonManifest)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              title="Tarkastele JSON-manifestia"
            >
              <FileCode className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
          {toastMessage && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* JSON Manifest Inspection (Non-executable declarative spec) */}
          {showJsonManifest && (
            <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto border border-slate-800 space-y-1">
              <div className="text-indigo-400 font-bold">// AOS Deklaratiivinen Skin-skeema (aos.skin.v0.1)</div>
              <pre>{JSON.stringify({ ...skin, views: skin.views.map(v => ({ ...v, widget_ids: orderMap[v.id] || v.widget_ids })) }, null, 2)}</pre>
            </div>
          )}

          {/* Experience Title Edit */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              Kokemuksen näyttönimi
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
            />
          </div>

          {/* View Selector Tabs */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
              Valitse muokattava näkymä
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {skin.views.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setActiveViewId(v.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    activeViewId === v.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>

          {/* Active Widgets in this View */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Näkymän widgetit & järjestys ({activeWidgetIds.length})
              </span>
              <span className="text-[11px] text-slate-500">
                Käytä nuolia siirtääksesi ylös/alas
              </span>
            </div>

            <div className="space-y-2">
              {activeWidgetIds.map((widgetId, index) => {
                const w = getWidgetInfo(widgetId);
                return (
                  <div
                    key={widgetId}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-slate-800 dark:text-slate-200">
                        {w?.title || widgetId}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {w?.component_type} · {w?.data_source}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveWidget(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 rounded"
                        title="Siirrä ylemmäs"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveWidget(index, 'down')}
                        disabled={index === activeWidgetIds.length - 1}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white disabled:opacity-30 rounded"
                        title="Siirrä alemmas"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeWidgetFromView(widgetId)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded ml-1"
                        title="Piilota tästä näkymästä"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add Available Widgets that are not yet active */}
          {skin.widgets.filter((w) => !activeWidgetIds.includes(w.id)).length > 0 && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                Lisättävissä olevat widgetit:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skin.widgets
                  .filter((w) => !activeWidgetIds.includes(w.id))
                  .map((w) => (
                    <button
                      key={w.id}
                      onClick={() => addWidgetToView(w.id)}
                      className="px-2.5 py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:border-indigo-400 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{w.title}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Palauta oletuksiin</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 transition-colors"
            >
              Peruuta (Cancel)
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Tallennetaan...' : 'Tallenna (Save)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
