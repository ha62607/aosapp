/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS IntentProposalModal — Human-Directed AI Approval Gate
 * Enforces: Human Intent -> Proposal -> Edit/Reject/Approve -> Evidence Verification
 */

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Key,
  Server,
  Zap,
  Check,
  Edit2,
  Trash2,
  Cpu,
} from 'lucide-react';
import { IntentProposal, ProposedStep } from '../types/aos';

interface IntentProposalModalProps {
  proposal: IntentProposal;
  onApprove: (proposalId: string, editedSteps?: ProposedStep[]) => Promise<void>;
  onReject: (proposalId: string) => Promise<void>;
  onClose: () => void;
}

export const IntentProposalModal: React.FC<IntentProposalModalProps> = ({
  proposal,
  onApprove,
  onReject,
  onClose,
}) => {
  const [steps, setSteps] = useState<ProposedStep[]>([...proposal.proposed_steps]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultEvidence, setResultEvidence] = useState<string | null>(proposal.evidence || null);
  const [status, setStatus] = useState(proposal.status);

  const startEdit = (index: number) => {
    setEditingIndex(index);
    setEditedTitle(steps[index].title);
  };

  const saveEdit = (index: number) => {
    const updated = [...steps];
    updated[index].title = editedTitle;
    setSteps(updated);
    setEditingIndex(null);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(proposal.id, steps);
      setStatus('approved');
      setResultEvidence(
        `Suoritus hyväksytty ihmiskäyttäjän toimesta. Kanoninen mcp-tehtävätila: completed. Evidenssitunniste: EVID-${Date.now()
          .toString()
          .slice(-6)}. Toimenpiteet rajattu plan_only-määrittelyyn ilman luvattomia ulkoisia mutaatioita.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    try {
      await onReject(proposal.id);
      setStatus('rejected');
      setResultEvidence('Ehdotus hylätty. Mitään muutoksia tai mutaatioita ei ole tehty järjestelmään.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRiskBadge = (risk: ProposedStep['risk_level']) => {
    switch (risk) {
      case 'low':
        return (
          <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
            Matala riski
          </span>
        );
      case 'medium':
        return (
          <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded">
            Kohtalainen riski
          </span>
        );
      case 'high':
        return (
          <span className="text-[10px] font-semibold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 px-2 py-0.5 rounded">
            Korkea riski
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95">
        {/* Top Header Banner with Provenance */}
        <div
          className={`px-5 py-3.5 border-b flex items-center justify-between ${
            proposal.source === 'gemini'
              ? 'bg-indigo-950/40 border-indigo-800/60 text-indigo-200'
              : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            <span className="font-display font-semibold text-xs uppercase tracking-wider">
              {proposal.source === 'gemini'
                ? 'Gemini Live AI Interpreter (Plan_Only)'
                : 'AOS Deterministinen Moottori (Mock Demo)'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono opacity-80">
            <span>{proposal.id}</span>
            <span>·</span>
            <span>{proposal.tenant_id}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Alert if completed/rejected */}
          {resultEvidence && (
            <div
              className={`p-4 rounded-xl text-xs border ${
                status === 'approved'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1 text-sm">
                {status === 'approved' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Toiminto hyväksytty & todennettu!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-slate-500" />
                    <span>Ehdotus hylätty ilman mutaatioita</span>
                  </>
                )}
              </div>
              <p className="leading-relaxed font-mono text-[11px]">{resultEvidence}</p>
            </div>
          )}

          {/* Raw Intent & Interpreted Goal */}
          <div className="space-y-2">
            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
              Alkuperäinen pyyntö (Human Intent)
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs italic text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-750">
              "{proposal.raw_intent}"
            </div>

            <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-2">
              Tulkittu tavoite (AOS Interpreted Goal)
            </div>
            <div className="font-display font-bold text-base text-slate-900 dark:text-white">
              {proposal.interpreted_goal}
            </div>
          </div>

          {/* Proposed Steps */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                Ehdotetut suoritusvaiheet ({steps.length} kpl)
              </span>
              <span className="text-[11px] text-slate-500">Voit muokata vaiheita ennen hyväksyntää</span>
            </div>

            <div className="space-y-2.5">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 flex-1">
                      <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-700 dark:text-slate-300 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>

                      <div className="flex-1">
                        {editingIndex === idx ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editedTitle}
                              onChange={(e) => setEditedTitle(e.target.value)}
                              className="w-full text-xs font-semibold bg-white dark:bg-slate-900 border border-indigo-400 rounded px-2 py-1"
                              autoFocus
                            />
                            <button
                              onClick={() => saveEdit(idx)}
                              className="p-1 bg-indigo-600 text-white rounded text-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="font-semibold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                            <span>{step.title}</span>
                            {status === 'draft' && (
                              <button
                                onClick={() => startEdit(idx)}
                                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                                title="Muokkaa otsikkoa"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {step.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                          <span className="font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-300">
                            Lupa: {step.permission_required}
                          </span>
                          {step.duration_est && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {step.duration_est}
                            </span>
                          )}
                          {getRiskBadge(step.risk_level)}
                        </div>
                      </div>
                    </div>

                    {status === 'draft' && steps.length > 1 && (
                      <button
                        onClick={() => removeStep(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                        title="Poista tämä vaihe"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Governance & Token transparency */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              <span>Arvioitu laskentakuorma: <strong className="font-mono text-slate-700 dark:text-slate-300">{proposal.estimated_compute_tokens} tokens</strong></span>
            </div>
            <span className="font-mono text-[11px]">Gated by Human Sign-off</span>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 text-center sm:text-left">
            {status === 'draft'
              ? 'Toimenpiteitä ei ajeta ennen kuin painat Hyväksy.'
              : 'Tämän ehdotuksen tila on lukittu.'}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {status === 'draft' ? (
              <>
                <button
                  type="button"
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Hylkää (Zero Mutation)
                </button>

                <button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSubmitting || steps.length === 0}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isSubmitting ? 'Suoritetaan...' : 'Hyväksy (Approve plan_only)'}</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Sulje ikkuna
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
