/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Product v0.1 — Interactive Multi-Device State Simulator
 * Demonstrates: One Account, N Authorized Devices, Synchronized Server-State
 */

import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Car,
  Laptop,
  Plus,
  Radio,
  Check,
  ShieldAlert,
  Server,
  Zap,
} from 'lucide-react';
import { AOSAccount, AOSDevice } from '../types/aos';

interface DeviceSimulatorBarProps {
  account: AOSAccount;
  devices: AOSDevice[];
  currentDevice: AOSDevice;
  onSelectDevice: (deviceId: string) => void;
  onAuthorizeDevice: (name: string, type: AOSDevice['type'], platform: string) => void;
}

export const DeviceSimulatorBar: React.FC<DeviceSimulatorBarProps> = ({
  account,
  devices,
  currentDevice,
  onSelectDevice,
  onAuthorizeDevice,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<AOSDevice['type']>('mobile_phone');

  const getDeviceIcon = (type: AOSDevice['type'], active: boolean) => {
    const color = active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500';
    switch (type) {
      case 'mobile_phone':
        return <Smartphone className={`w-4 h-4 ${color}`} />;
      case 'tablet':
        return <Tablet className={`w-4 h-4 ${color}`} />;
      case 'vehicle_display':
        return <Car className={`w-4 h-4 ${color}`} />;
      case 'workstation':
        return <Laptop className={`w-4 h-4 ${color}`} />;
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeviceName.trim()) return;
    const platform =
      newDeviceType === 'mobile_phone'
        ? 'iOS 18 PWA'
        : newDeviceType === 'tablet'
        ? 'Galaxy Tab S9'
        : newDeviceType === 'vehicle_display'
        ? 'Apple CarPlay'
        : 'Windows 11 Edge';
    onAuthorizeDevice(newDeviceName.trim(), newDeviceType, platform);
    setNewDeviceName('');
    setShowAddModal(false);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300 py-2 px-4 shadow-inner">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
        {/* Left: Engine & Account sync banner */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-200">
            <Server className="w-3.5 h-3.5 text-indigo-400" />
            <span>AOS Engine:</span>
          </div>
          <span className="text-slate-400 truncate">
            Yhteinen tilitila <code className="text-indigo-300 font-mono text-[11px]">{account.tenant_id}</code>
          </span>
          <span className="hidden sm:inline text-slate-600">·</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2 py-0.5 rounded-full">
            <Radio className="w-2.5 h-2.5 animate-pulse" /> Synkronoitu ({devices.length} laitetta)
          </span>
        </div>

        {/* Right: Device switch buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden lg:inline">
            Aktiivinen laite:
          </span>

          {devices.map((device) => {
            const isActive = device.id === currentDevice.id;
            return (
              <button
                key={device.id}
                onClick={() => onSelectDevice(device.id)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700/60'
                }`}
              >
                {getDeviceIcon(device.type, isActive)}
                <span className="truncate max-w-[120px] sm:max-w-[150px]">{device.name}</span>
                {isActive && <Check className="w-3 h-3 text-white ml-0.5" />}
              </button>
            );
          })}

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-dashed border-slate-700 text-xs shrink-0 transition-colors"
            title="Valtuuta uusi laite tälle tilille"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Uusi</span>
          </button>
        </div>
      </div>

      {/* Add Device Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display font-bold text-base">Valtuuta uusi laite tilille</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Kaikki saman tilin laitteet jakavat saman AOS Engine -moottorin, tavoitepuun ja
              muokatut kokemukset tiukasti rajatulla laitevaltuutuksella.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Laitteen nimi</label>
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  placeholder="esim. Kenttähuolto iPhone 15"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Laitetyyppi</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: 'mobile_phone', label: 'Älypuhelin' },
                    { type: 'tablet', label: 'Tabletti' },
                    { type: 'vehicle_display', label: 'Ajoneuvonäyttö' },
                    { type: 'workstation', label: 'Työasema' },
                  ].map((item) => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => setNewDeviceType(item.type as AOSDevice['type'])}
                      className={`px-3 py-2 rounded-lg border text-left font-medium transition-colors ${
                        newDeviceType === item.type
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Peruuta
                </button>
                <button
                  type="submit"
                  disabled={!newDeviceName.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium transition-colors shadow-sm"
                >
                  Valtuuta laite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
