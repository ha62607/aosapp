/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS MetricGroupWidget — High-legibility tabular metrics (Zero-pill, WCAG AA)
 */

import React from 'react';
import { WidgetDefinition } from '../../types/aos';

interface MetricGroupWidgetProps {
  widget: WidgetDefinition;
  skinId: string;
}

export const MetricGroupWidget: React.FC<MetricGroupWidgetProps> = ({
  widget,
  skinId,
}) => {
  let metrics: Array<{ label: string; value: string; subtext: string; change?: string }> = [];

  if (skinId === 'field-service-demo') {
    metrics = [
      { label: 'Tänään keikkoja', value: '3', subtext: 'Kaikki aikataulutettu' },
      { label: 'Kriittiset työt', value: '1', subtext: 'Yale Doorman L3S' },
      { label: 'Varaosasaatavuus', value: '100%', subtext: 'Autovarasto tarkastettu' },
      { label: 'Toteutunut SLA', value: '98.4%', subtext: 'Tavoite > 95%' },
    ];
  } else if (skinId === 'driver-demo') {
    metrics = [
      { label: 'Pysähdyksiä', value: '4', subtext: '1 suoritettu · 3 jäljellä' },
      { label: 'Seuraava ETA', value: '10:40', subtext: 'Itämerenkatu 11' },
      { label: 'Akun varaustaso', value: '74%', subtext: 'Toimintamatka 260 km' },
      { label: 'Ajoaikaa jäljellä', value: '3 h 40 min', subtext: 'Lakisääteinen lepoaika ok' },
    ];
  } else {
    metrics = [
      { label: 'Aktiiviset tavoitteet', value: '3', subtext: 'DMS Goal Tree linkitetty' },
      { label: 'Toteutusaste', value: '84%', subtext: 'Q4 operatiivinen SLA' },
      { label: 'AOS Token-käyttö', value: '14.2k', subtext: 'Kiintiö 100k / kk' },
      { label: 'Valtuutetut laitteet', value: '4', subtext: 'Kaikki synkronoitu' },
    ];
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100">
          {widget.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
          <span>{widget.data_source}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map((item, idx) => (
          <div
            key={idx}
            className="p-3 sm:p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750/70"
          >
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">
              {item.label}
            </div>
            <div className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white mt-1 tabular-nums">
              {item.value}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 truncate">
              {item.subtext}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
