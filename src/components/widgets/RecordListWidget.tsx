/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS RecordListWidget — Domain lists (Field Jobs, Driver Stops, DMS Goals, Inventory)
 */

import React, { useState } from 'react';
import {
  Briefcase,
  MapPin,
  Target,
  Package,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { WidgetDefinition } from '../../types/aos';
import {
  INITIAL_FIELD_JOBS,
  INITIAL_DRIVER_STOPS,
  INITIAL_DMS_GOALS,
} from '../../data/mockFixtures';

interface RecordListWidgetProps {
  widget: WidgetDefinition;
  skinId: string;
  onOpenIntentWithText?: (text: string) => void;
}

export const RecordListWidget: React.FC<RecordListWidgetProps> = ({
  widget,
  skinId,
  onOpenIntentWithText,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Render Field Service Jobs
  if (widget.data_source === 'demo:field-service') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              {widget.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              3 aikataulutettua lukkosepän ja huoltoteknikon tehtävää
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">demo:field-service</span>
        </div>

        <div className="space-y-3">
          {INITIAL_FIELD_JOBS.map((job) => {
            const isExpanded = expandedId === job.id;
            return (
              <div
                key={job.id}
                className="border border-slate-200/80 dark:border-slate-800 rounded-xl p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 transition-colors"
              >
                <div
                  className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  onClick={() => toggleExpand(job.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-mono text-slate-400 text-[11px]">{job.id}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{job.time_window}</span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                      <span className={`text-[11px] font-medium ${
                        job.priority === 'Kiireellinen' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'
                      }`}>
                        {job.priority}
                      </span>
                    </div>

                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white mt-1">
                      {job.customer}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {job.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-md border border-teal-200 dark:border-teal-800/50">
                      {job.type}
                    </span>
                    <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-750 text-xs text-slate-600 dark:text-slate-300 space-y-2 animate-in fade-in">
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Työn kuvaus: </span>
                      {job.description}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700 dark:text-slate-200">Tarvittavat varaosat: </span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {job.required_parts.map((p, idx) => (
                          <span
                            key={idx}
                            className="bg-white dark:bg-slate-700 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-600 text-[11px] font-mono text-slate-700 dark:text-slate-300"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    {onOpenIntentWithText && (
                      <div className="pt-1 flex justify-end">
                        <button
                          onClick={() =>
                            onOpenIntentWithText(
                              `Valmistele keikan ${job.id} (${job.customer}) huoltosuunnitelma ja tarkista osien saatavuus`
                            )
                          }
                          className="flex items-center gap-1.5 text-xs text-teal-600 dark:text-teal-400 hover:underline font-medium"
                        >
                          Valmistele huoltosuunnitelma AOS:llä
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Render Driver Stops
  if (widget.data_source === 'demo:driver') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              {widget.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Optimoitu reitti ja toimituskohteet
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400">demo:driver</span>
        </div>

        <div className="space-y-3">
          {INITIAL_DRIVER_STOPS.map((stop) => (
            <div
              key={stop.id}
              className={`border rounded-xl p-3.5 transition-colors ${
                stop.completed
                  ? 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800 opacity-70'
                  : stop.stop_number === 2
                  ? 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/50 ring-1 ring-orange-400/30'
                  : 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      stop.completed
                        ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        : stop.stop_number === 2
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {stop.completed ? <CheckCircle2 className="w-4 h-4" /> : stop.stop_number}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {stop.location_name}
                      </span>
                      <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
                      <span className="text-slate-500 font-mono text-[11px]">ETA {stop.estimated_arrival}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {stop.address}
                    </div>
                    <div className="text-xs text-slate-700 dark:text-slate-300 mt-2 bg-slate-100/70 dark:bg-slate-800/80 p-2 rounded-lg">
                      <span className="font-medium text-slate-500 dark:text-slate-400">Ohje: </span>
                      {stop.instructions}
                    </div>
                  </div>
                </div>

                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded shrink-0">
                  {stop.stop_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render DMS Goals
  if (widget.data_source === 'dms:goals') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3.5">
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              {widget.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Jaettu tavoitehierarkia ja konteksti DMS-protokollan mukaisesti
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-400">dms:goals</span>
        </div>

        <div className="space-y-3">
          {INITIAL_DMS_GOALS.map((goal) => (
            <div
              key={goal.id}
              className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50/50 dark:bg-slate-800/40"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900 dark:text-white">
                  {goal.title}
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold tabular-nums">
                  {goal.progress}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>

              <div className="text-[11px] font-mono text-slate-400 mt-2 truncate">
                Provenance: {goal.provenance}
              </div>

              {/* Sub-goals */}
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Alatavoitteet:
                </div>
                {goal.children.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200/60 dark:border-slate-700"
                  >
                    <span className="text-slate-800 dark:text-slate-200">{sub.title}</span>
                    <span className="font-mono text-slate-500 tabular-nums">{sub.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Inventory List
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          {widget.title}
        </h3>
        <span className="text-[11px] font-mono text-slate-400">demo:inventory</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
        {[
          { name: 'Abloy Protec2 CY062 Sylinteri', qty: '4 kpl', status: 'Varastossa' },
          { name: 'Yale Doorman L3S Chrome', qty: '2 kpl', status: 'Varastossa' },
          { name: 'Dormakaba TS 93 Liukuvarsi', qty: '3 kpl', status: 'Varastossa' },
          { name: 'Abloy Sento Avainaihio', qty: '28 kpl', status: 'Varastossa' },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 flex items-center justify-between"
          >
            <div>
              <div className="font-medium text-slate-800 dark:text-slate-200">{item.name}</div>
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">{item.status}</div>
            </div>
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300 tabular-nums">
              {item.qty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
