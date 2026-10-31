/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS IntentComposerWidget — Natural Language Composer (Welcoming AI Prompt)
 */

import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Mic, Send, Bot, ShieldCheck } from 'lucide-react';
import { WidgetDefinition } from '../../types/aos';

interface IntentComposerWidgetProps {
  widget: WidgetDefinition;
  skinId: string;
  onInterpretIntent: (intentText: string) => void;
  isInterpreting?: boolean;
}

export const IntentComposerWidget: React.FC<IntentComposerWidgetProps> = ({
  widget,
  skinId,
  onInterpretIntent,
  isInterpreting = false,
}) => {
  const [inputText, setInputText] = useState('');
  const [voiceNotice, setVoiceNotice] = useState(false);

  const getQuickPrompts = () => {
    if (skinId === 'field-service-demo') {
      return [
        'Prepare a plan for tomorrow\'s three service visits',
        'Valmistele huomisen kolmen lukituskeikan aikataulu ja varaosat',
        'Tarkista huoltoauton Abloy CY062 -varaosatilanne',
      ];
    }
    if (skinId === 'driver-demo') {
      return [
        'Laske optimaalinen reitti ja varikkopysähdys seuraavalle etapille',
        'Synkronoi Itämerentornin porttikoodi ajoneuvonäyttöön',
        'Etsi 20 min latauspiste Keimolanportista',
      ];
    }
    return [
      'Valmistele huomisen kolmen palvelukäynnin suunnitelma',
      'Yhdistä päivän tavoitteet ja luo yhteenveto huoltotilanteesta',
      'Muodosta strukturoitu ehdotus viikon tehtävistä',
    ];
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isInterpreting) return;
    onInterpretIntent(inputText.trim());
  };

  const handleQuickClick = (prompt: string) => {
    setInputText(prompt);
    onInterpretIntent(prompt);
  };

  const handleVoiceClick = () => {
    setVoiceNotice(true);
    setTimeout(() => setVoiceNotice(false), 3000);
    // Graceful voice demo placeholder as required by brief: never claim functional audio unless real
    setInputText('Valmistele huomisen kolmen lukkoasennuskäynnin aikataulu ja tarvittavat varaosat');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-indigo-600/10 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h2 className="font-display font-bold text-base text-slate-900 dark:text-white">
            {widget.title}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Ihmisen hyväksyntä vaaditaan (plan_only)</span>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
        Syötä toive luonnollisella kielellä. AOS tulkitsee sen rajatuksi ehdotukseksi (Proposal),
        joka sisältää tarvittavat luvat, vaiheet ja riskitarkastelun ennen suoritusta.
      </p>

      {/* Composer Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="esim. 'Valmistele huomisen kolmen lukitustyön aikataulu ja varaosat'..."
            disabled={isInterpreting}
            className="w-full pl-4 pr-24 py-3.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all shadow-inner"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {/* Graceful Voice Input Button */}
            <button
              type="button"
              onClick={handleVoiceClick}
              className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700"
              title="Äänisyöte (Demo: simuloi puheentunnistusta)"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputText.trim() || isInterpreting}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-all"
            >
              {isInterpreting ? (
                <span>Tulkitaan...</span>
              ) : (
                <>
                  <span className="hidden sm:inline">Lähetä</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {voiceNotice && (
        <div className="mt-2 text-[11px] text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 p-2 rounded-lg animate-in fade-in">
          Äänisyöte: v0.1:n turvallisuusrajaus käyttää simuloitua äänitranskriptiota ilman mikrofonilupien väärinkäyttöä.
        </div>
      )}

      {/* Quick Prompts */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
          Kokeile esimerkkipyyntöjä:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {getQuickPrompts().map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickClick(prompt)}
              className="text-left text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-lg border border-slate-200/60 dark:border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <span className="truncate max-w-[280px] sm:max-w-md">{prompt}</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400 shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
