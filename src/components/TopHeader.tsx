/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Top Bar Contract: [Brand title, one line] — [Nav / Context] — [Primary action]
 */

import React, { useState } from 'react';
import {
  Layers,
  Smartphone,
  Tablet,
  Car,
  Laptop,
  CheckCircle2,
  ShieldCheck,
  Download,
  SlidersHorizontal,
} from 'lucide-react';
import { AOSAccount, AOSDevice, SkinManifest } from '../types/aos';

interface TopHeaderProps {
  account: AOSAccount;
  currentDevice: AOSDevice;
  allDevices: AOSDevice[];
  activeSkin: SkinManifest;
  allSkins: SkinManifest[];
  onSelectSkin: (skinId: string) => void;
  onSelectDevice: (deviceId: string) => void;
  onOpenCustomizer: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  account,
  currentDevice,
  allDevices,
  activeSkin,
  allSkins,
  onSelectSkin,
  onSelectDevice,
  onOpenCustomizer,
}) => {
  const [showSkinMenu, setShowSkinMenu] = useState(false);
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);

  const getDeviceIcon = (type: AOSDevice['type']) => {
    switch (type) {
      case 'mobile_phone':
        return <Smartphone className="w-3.5 h-3.5 text-indigo-500" />;
      case 'tablet':
        return <Tablet className="w-3.5 h-3.5 text-teal-500" />;
      case 'vehicle_display':
        return <Car className="w-3.5 h-3.5 text-amber-500" />;
      case 'workstation':
        return <Laptop className="w-3.5 h-3.5 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md text-slate-100 border-b border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark + subtle tenant indicator */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm shadow-indigo-500/20">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base tracking-tight text-white whitespace-nowrap">
                AOS
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                v0.1
              </span>
            </div>
            <div className="text-[11px] text-slate-400 truncate max-w-[140px] sm:max-w-[200px]">
              {account.email}
            </div>
          </div>
        </div>

        {/* Zone 2: Active Device context switch (One Account, N Devices) */}
        <div className="relative">
          <button
            onClick={() => {
              setShowDeviceMenu(!showDeviceMenu);
              setShowSkinMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-200 transition-colors whitespace-nowrap"
            title="Vaihda aktiivista laitenäkymää"
          >
            {getDeviceIcon(currentDevice.type)}
            <span className="hidden sm:inline font-medium">{currentDevice.name}</span>
            <span className="sm:hidden font-medium">Laite ({allDevices.length})</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </button>

          {showDeviceMenu && (
            <div className="absolute right-0 sm:left-0 sm:right-auto mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-xl p-2 z-50 text-xs">
              <div className="px-2 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                Valtuutetut laitteet (N Devices)
              </div>
              <div className="space-y-1 mt-1">
                {allDevices.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDevice(d.id);
                      setShowDeviceMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      d.id === currentDevice.id
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium border border-indigo-500/30'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getDeviceIcon(d.type)}
                      <div className="truncate">
                        <div className="truncate font-medium">{d.name}</div>
                        <div className="text-[10px] text-slate-500">{d.platform}</div>
                      </div>
                    </div>
                    {d.id === currentDevice.id && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Zone 3: Primary Action & Skin Selector */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenCustomizer}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            title="Muokkaa nykyisen kokemuksen widgettejä"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Muokkaa</span>
          </button>

          {/* Skin Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowSkinMenu(!showSkinMenu);
                setShowDeviceMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{activeSkin.display_name}</span>
            </button>

            {showSkinMenu && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs">
                <div className="px-2 py-1 font-semibold text-slate-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                  <span>Valitse Skin</span>
                  <span className="text-emerald-400">Yhteinen moottori</span>
                </div>
                <div className="space-y-1 mt-1">
                  {allSkins
                    .filter((s) => s.installed)
                    .map((skin) => (
                      <button
                        key={skin.skin_id}
                        onClick={() => {
                          onSelectSkin(skin.skin_id);
                          setShowSkinMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                          skin.skin_id === activeSkin.skin_id
                            ? 'bg-slate-800 text-white font-medium border border-slate-700'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 font-medium">
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: skin.accent_color }}
                            />
                            {skin.display_name}
                          </div>
                          <div className="text-[10px] text-slate-400">{skin.tagline}</div>
                        </div>
                        {skin.skin_id === activeSkin.skin_id && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        )}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
