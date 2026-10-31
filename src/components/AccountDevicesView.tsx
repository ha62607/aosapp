/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS AccountDevicesView — One Account, N Devices & Activity Evidence
 */

import React from 'react';
import {
  Server,
  Smartphone,
  Tablet,
  Car,
  Laptop,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Key,
  Database,
  ArrowRight,
} from 'lucide-react';
import { AOSAccount, AOSDevice, ActivityEvent } from '../types/aos';

interface AccountDevicesViewProps {
  account: AOSAccount;
  devices: AOSDevice[];
  currentDevice: AOSDevice;
  activities: ActivityEvent[];
  onSelectDevice: (deviceId: string) => void;
}

export const AccountDevicesView: React.FC<AccountDevicesViewProps> = ({
  account,
  devices,
  currentDevice,
  activities,
  onSelectDevice,
}) => {
  const getDeviceIcon = (type: AOSDevice['type']) => {
    switch (type) {
      case 'mobile_phone':
        return <Smartphone className="w-5 h-5 text-indigo-500" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-teal-500" />;
      case 'vehicle_display':
        return <Car className="w-5 h-5 text-amber-500" />;
      case 'workstation':
        return <Laptop className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Account & Entitlements Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Server className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 dark:text-white">
                AOS Yhteinen Tili & Käyttövaltuutus
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Yksi hallittu tili yhdistää useat laitteet ja toimialakuoret saman tavoitekontekstin alle.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg border border-indigo-200 dark:border-indigo-800">
              Tilaus: {account.plan}
            </span>
          </div>
        </div>

        {/* Account Details Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <div className="text-slate-400 font-medium">Käyttäjätunnus</div>
            <div className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">{account.email}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Tenant ID</div>
            <div className="font-mono text-slate-700 dark:text-slate-300 mt-0.5 truncate">{account.tenant_id}</div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Token-käyttö tässä kuussa</div>
            <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5 tabular-nums">
              {account.monthly_token_usage.toLocaleString()} / {account.monthly_token_limit.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-slate-400 font-medium">Valtuutettu palvelinalue</div>
            <div className="font-mono text-slate-700 dark:text-slate-300 mt-0.5">europe-west2 (GCP)</div>
          </div>
        </div>
      </div>

      {/* Authorized Devices (N Devices) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">
              Valtuutetut laitteet (N Devices)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kaikki laitteet on liitetty samaan AOS Engineen palvelintasoisella todennuksella
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">{devices.length} aktiivista</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {devices.map((device) => {
            const isCurrent = device.id === currentDevice.id;
            return (
              <div
                key={device.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 ring-1 ring-indigo-500/30'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shrink-0">
                      {getDeviceIcon(device.type)}
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{device.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-950 px-2 py-0.5 rounded-full">
                            Tämä laite
                          </span>
                        )}
                      </h4>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {device.platform} · Viimeksi aktiivinen: {device.last_seen}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {device.permitted_capabilities.map((cap, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200/60 dark:border-slate-700"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      onClick={() => onSelectDevice(device.id)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-indigo-600 hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors shrink-0"
                    >
                      Valitse
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity & Execution Evidence */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <span>AOS Tapahtumaloki & Toimintojen evidenssi</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Kanoniset mcp-connector -tehtävätilat ja suoritusten tarkastusketju
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">Audit Trail</span>
        </div>

        <div className="space-y-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {act.summary}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{act.timestamp}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300">{act.device_name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">{act.skin_id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold uppercase">
                  {act.canonical_status}
                </span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  act.source === 'live'
                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {act.source}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
