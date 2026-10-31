/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * AOS Declarative Widget Renderer
 * Enforces schema validation against allowlisted component types.
 * Never executes arbitrary scripts or HTML from manifests.
 */

import React from 'react';
import { WidgetDefinition } from '../../types/aos';
import { MetricGroupWidget } from './MetricGroupWidget';
import { RecordListWidget } from './RecordListWidget';
import { IntentComposerWidget } from './IntentComposerWidget';
import { RouteDisplayWidget } from './RouteDisplayWidget';
import { NotesBoardWidget } from './NotesBoardWidget';
import { AlertCircle } from 'lucide-react';

interface WidgetRendererProps {
  widget: WidgetDefinition;
  skinId: string;
  onInterpretIntent: (intentText: string) => void;
  onOpenIntentWithText?: (text: string) => void;
  isInterpreting?: boolean;
}

export const WidgetRenderer: React.FC<WidgetRendererProps> = ({
  widget,
  skinId,
  onInterpretIntent,
  onOpenIntentWithText,
  isInterpreting = false,
}) => {
  switch (widget.component_type) {
    case 'metric-group':
      return <MetricGroupWidget widget={widget} skinId={skinId} />;

    case 'record-list':
      return (
        <RecordListWidget
          widget={widget}
          skinId={skinId}
          onOpenIntentWithText={onOpenIntentWithText}
        />
      );

    case 'intent-composer':
      return (
        <IntentComposerWidget
          widget={widget}
          skinId={skinId}
          onInterpretIntent={onInterpretIntent}
          isInterpreting={isInterpreting}
        />
      );

    case 'route-display':
      return (
        <RouteDisplayWidget
          widget={widget}
          onOpenIntentWithText={onOpenIntentWithText}
        />
      );

    case 'notes-board':
      return <NotesBoardWidget widget={widget} />;

    default:
      return (
        <div className="p-4 rounded-xl border border-red-250 bg-red-50 text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold">Luvaton tai tuntematon widget-tyyppi</div>
            <div>
              Komponenttityyppiä <code>{(widget as any).component_type}</code> ei sallita
              turvallisuusrajauksessa. Vain sallitut deklaratiiviset widgetit suoritetaan.
            </div>
          </div>
        </div>
      );
  }
};
