/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Mobile Thumb Bar Navigation (Natural Reach Zone, touch targets >= 44px)
 */

import React from 'react';
import { Home, Layers, Sparkles, Palette, Activity } from 'lucide-react';
import { SkinManifest } from '../types/aos';

export type TabId = 'home' | 'experience' | 'library' | 'studio' | 'activity';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  activeSkin: SkinManifest;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  activeSkin,
}) => {
  const tabs = [
    {
      id: 'home' as TabId,
      label: 'Koti',
      icon: <Home className="w-5 h-5" />,
    },
    {
      id: 'experience' as TabId,
      label: activeSkin.display_name,
      icon: <Layers className="w-5 h-5" />,
      accent: activeSkin.accent_color,
    },
    {
      id: 'library' as TabId,
      label: 'Skinit',
      icon: <Sparkles className="w-5 h-5" />,
    },
    {
      id: 'studio' as TabId,
      label: 'UI Studio',
      icon: <Palette className="w-5 h-5" />,
    },
    {
      id: 'activity' as TabId,
      label: 'Laitteet',
      icon: <Activity className="w-5 h-5" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] py-1 transition-all ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 font-normal'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {isActive && (
                  <span
                    className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: tab.accent || '#4f46e5' }}
                  />
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-1 truncate max-w-[70px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
