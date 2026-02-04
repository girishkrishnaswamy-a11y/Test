'use client';

import { useState } from 'react';
import { ClinicalAction } from '@/types';
import { CompetencyBadge } from '@/components/ui/CompetencyBadge';

interface ActionPanelProps {
  availableActions: ClinicalAction[];
  performedActions: string[];
  onPerformAction: (actionId: string) => void;
}

export function ActionPanel({
  availableActions,
  performedActions,
  onPerformAction,
}: ActionPanelProps) {
  const [selectedAction, setSelectedAction] = useState<ClinicalAction | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const handleActionClick = (action: ClinicalAction) => {
    if (performedActions.includes(action.id)) {
      // Show previous result again
      setLastResult(action.results || action.feedback || 'Action completed.');
      setShowResult(true);
      setTimeout(() => setShowResult(false), 3000);
      return;
    }

    setSelectedAction(action);
  };

  const handleConfirmAction = () => {
    if (!selectedAction) return;

    onPerformAction(selectedAction.id);
    setLastResult(selectedAction.results || selectedAction.feedback || 'Action completed.');
    setShowResult(true);
    setSelectedAction(null);

    setTimeout(() => setShowResult(false), 3000);
  };

  const getCategoryIcon = (category: ClinicalAction['category']) => {
    switch (category) {
      case 'examination':
        return '🩺';
      case 'procedure':
        return '💉';
      case 'order':
        return '📋';
      case 'medication':
        return '💊';
      case 'documentation':
        return '📝';
      case 'consultation':
        return '👥';
      default:
        return '•';
    }
  };

  const getAppropriatenessStyle = (appropriateness: ClinicalAction['appropriateness']) => {
    switch (appropriateness) {
      case 'indicated':
        return 'border-green-200 hover:border-green-400';
      case 'optional':
        return 'border-blue-200 hover:border-blue-400';
      case 'not_indicated':
        return 'border-yellow-200 hover:border-yellow-400';
      case 'contraindicated':
        return 'border-red-200 hover:border-red-400';
      default:
        return 'border-gray-200 hover:border-gray-400';
    }
  };

  const groupedActions = availableActions.reduce(
    (acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = [];
      }
      acc[action.category].push(action);
      return acc;
    },
    {} as Record<string, ClinicalAction[]>
  );

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold text-gray-900">Clinical Actions</h2>
        <p className="text-xs text-gray-500 mt-1">
          {performedActions.length} of {availableActions.length} actions performed
        </p>
      </div>
      <div className="card-body">
        {/* Result Display */}
        {showResult && lastResult && (
          <div className="mb-4 p-3 bg-clinical-50 border border-clinical-200 rounded-lg animate-fadeIn">
            <p className="text-xs font-medium text-clinical-600 uppercase tracking-wide mb-1">
              Result
            </p>
            <p className="text-sm text-clinical-900">{lastResult}</p>
          </div>
        )}

        {/* Action Categories */}
        <div className="space-y-4">
          {Object.entries(groupedActions).map(([category, actions]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {getCategoryIcon(category as ClinicalAction['category'])}{' '}
                {category.replace('_', ' ')}
              </h3>
              <div className="space-y-2">
                {actions.map((action) => {
                  const isPerformed = performedActions.includes(action.id);
                  return (
                    <button
                      key={action.id}
                      onClick={() => handleActionClick(action)}
                      className={`action-card w-full text-left ${getAppropriatenessStyle(
                        action.appropriateness
                      )} ${isPerformed ? 'bg-gray-50 opacity-75' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {isPerformed && <span className="text-green-600 mr-1">✓</span>}
                            {action.name}
                          </p>
                          <p className="text-xs text-gray-600 mt-0.5">{action.description}</p>
                        </div>
                      </div>
                      {action.competencies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {action.competencies.slice(0, 2).map((comp) => (
                            <CompetencyBadge key={comp} competency={comp} size="sm" />
                          ))}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {selectedAction && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-fadeIn">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Confirm Action
                </h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to perform:{' '}
                  <span className="font-medium">{selectedAction.name}</span>?
                </p>
                <p className="text-sm text-gray-500 mb-4">{selectedAction.description}</p>

                {selectedAction.requiredEquipment && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Required Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedAction.requiredEquipment.map((eq, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                        >
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedAction(null)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button onClick={handleConfirmAction} className="btn-primary flex-1">
                    Perform Action
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
