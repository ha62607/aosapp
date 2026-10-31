/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS RouteDisplayWidget — Driver navigation & contextual suggestions (High visibility)
 */

import React, { useState } from 'react';
import {
  Navigation,
  Clock,
  Compass,
  Zap,
  Coffee,
  CheckCircle,
  Eye,
  Maximize2,
  Minimize2,
  ArrowRight,
} from 'lucide-react';
import { WidgetDefinition } from '../../types/aos';

interface RouteDisplayWidgetProps {
  widget: WidgetDefinition;
  onOpenIntentWithText?: (text: string) => void;
}

export const RouteDisplayWidget: React.FC<RouteDisplayWidgetProps> = ({
  widget,
  onOpenIntentWithText,
}) => {
  const [driverHighContrast, setDriverHighContrast] = useState(false);

  return (
    <div
      className={`border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
        driverHighContrast
          ? 'bg-black text-white border-amber-500 ring-2 ring-amber-500/50'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-orange-500" />
          <h3 className="font-display font-bold text-sm sm:text-base">
            {widget.title}
          </h3>
        </div>

        {/* Compact driver mode toggle */}
        <button
          onClick={() => setDriverHighContrast(!driverHighContrast)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
            driverHighContrast
              ? 'bg-amber-500 text-black hover:bg-amber-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
          }`}
          title="Vaihda korkean kontrastin ajotilaan"
        >
          {driverHighContrast ? (
            <>
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Vakionäkymä</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Korkean kontrastin ajotila</span>
            </>
          )}
        </button>
      </div>

      {/* Main Stop Card */}
      <div
        className={`p-4 rounded-xl border mb-4 ${
          driverHighContrast
            ? 'bg-zinc-900 border-zinc-700'
            : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-750'
        }`}
      >
        <div className="flex items-center justify-between text-xs text-orange-600 dark:text-orange-400 font-bold uppercase tracking-wider mb-1">
          <span>Seuraava pysähdys #3</span>
          <span className="font-mono text-sm tabular-nums">ETA 10:40 (18 min)</span>
        </div>

        <div className="text-xl sm:text-2xl font-bold font-display mt-0.5">
          Itämerentorni
        </div>
        <div className="text-sm opacity-80 mt-0.5">
          Itämerenkatu 11, Helsinki · Huoltoparkki C2
        </div>

        <div className="mt-3 p-3 rounded-lg bg-orange-100/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 text-xs">
          <div className="font-semibold text-orange-900 dark:text-orange-300 mb-0.5">
            Ajo- ja porttiohje:
          </div>
          <div className="text-orange-800 dark:text-orange-200">
            Aja lastausrampin kautta. Porttikoodi: <span className="font-mono font-bold">#4819</span>. Soita aulaan jos puomi on alhaalla.
          </div>
        </div>
      </div>

      {/* Contextual Smart Action Card */}
      <div
        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          driverHighContrast
            ? 'bg-zinc-900 border-amber-700/80'
            : 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
        }`}
      >
        <div className="flex items-start gap-2.5">
          <Coffee className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              AOS Kontekstisuositus:
            </span>{' '}
            <span className="text-slate-600 dark:text-slate-300">
              ABC Keimolanportti — 20 min lataus- ja lepotauko klo 12:45 ennen iltapäivän huoltokeikkaa.
            </span>
          </div>
        </div>

        {onOpenIntentWithText && (
          <button
            onClick={() =>
              onOpenIntentWithText(
                'Laske optimaalinen reitti ja varikkopysähdys seuraavalle etapille'
              )
            }
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shrink-0 shadow-xs transition-colors"
          >
            <span>Tarkastele ehdotusta</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
