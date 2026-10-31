/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS NotesBoardWidget — Shared cross-skin notes & goals
 */

import React, { useState } from 'react';
import { FileText, Plus, Pin, Calendar } from 'lucide-react';
import { WidgetDefinition } from '../../types/aos';
import { INITIAL_NOTES } from '../../data/mockFixtures';

interface NotesBoardWidgetProps {
  widget: WidgetDefinition;
}

export const NotesBoardWidget: React.FC<NotesBoardWidgetProps> = ({ widget }) => {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('Yleinen');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newNote = {
      id: `note-${Date.now()}`,
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      date: 'Juuri nyt',
    };
    setNotes([newNote, ...notes]);
    setNewTitle('');
    setNewContent('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-indigo-500" />
          <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-100">
            {widget.title}
          </h3>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Lisää merkintä</span>
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAdd} className="mb-4 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-250 dark:border-slate-700 rounded-xl space-y-2.5 text-xs">
          <div>
            <input
              type="text"
              placeholder="Muistiinpanon otsikko..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <div>
            <textarea
              placeholder="Sisältö..."
              rows={2}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 text-slate-500 hover:text-slate-700"
            >
              Peruuta
            </button>
            <button
              type="submit"
              disabled={!newTitle.trim()}
              className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-medium disabled:opacity-50"
            >
              Tallenna
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-750 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {note.category}
                </span>
                <span>{note.date}</span>
              </div>
              <h4 className="font-semibold text-xs text-slate-900 dark:text-white">
                {note.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {note.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
