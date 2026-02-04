'use client';

import { useState } from 'react';
import { DialogueNode, DialogueOption } from '@/types';
import { CompetencyBadge } from '@/components/ui/CompetencyBadge';

interface DialoguePanelProps {
  currentNode: DialogueNode;
  onSelectOption: (option: DialogueOption) => void;
  dialogueHistory: Array<{
    nodeContent: string;
    selectedResponse?: string;
    isPatient: boolean;
  }>;
}

export function DialoguePanel({
  currentNode,
  onSelectOption,
  dialogueHistory,
}: DialoguePanelProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastFeedback, setLastFeedback] = useState<{
    text: string;
    appropriateness: string;
  } | null>(null);

  const handleOptionSelect = (option: DialogueOption) => {
    setSelectedOption(option.id);
    setShowFeedback(true);
    setLastFeedback({
      text: option.feedback || 'Response recorded.',
      appropriateness: option.appropriateness,
    });

    // Auto-advance after showing feedback
    setTimeout(() => {
      onSelectOption(option);
      setSelectedOption(null);
      setShowFeedback(false);
    }, 2500);
  };

  const getAppropriatenessColor = (appropriateness: string) => {
    switch (appropriateness) {
      case 'optimal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'acceptable':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'suboptimal':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'inappropriate':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getAppropriatenessLabel = (appropriateness: string) => {
    switch (appropriateness) {
      case 'optimal':
        return 'Excellent Choice';
      case 'acceptable':
        return 'Acceptable';
      case 'suboptimal':
        return 'Could Be Better';
      case 'inappropriate':
        return 'Not Recommended';
      default:
        return '';
    }
  };

  return (
    <div className="card h-full flex flex-col">
      <div className="card-header flex-shrink-0">
        <h2 className="font-semibold text-gray-900">Clinical Encounter</h2>
      </div>

      {/* Dialogue History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {dialogueHistory.map((entry, i) => (
          <div
            key={i}
            className={`animate-fadeIn ${entry.isPatient ? '' : 'flex flex-col items-end'}`}
          >
            <div
              className={`dialogue-bubble ${
                entry.isPatient ? 'dialogue-bubble-patient' : 'dialogue-bubble-clinician'
              }`}
            >
              {entry.isPatient && (
                <span className="text-xs text-gray-500 block mb-1">Patient</span>
              )}
              <p className="text-sm whitespace-pre-wrap">{entry.nodeContent}</p>
            </div>
            {entry.selectedResponse && (
              <div className="dialogue-bubble dialogue-bubble-clinician mt-2">
                <span className="text-xs text-clinical-200 block mb-1">You</span>
                <p className="text-sm">{entry.selectedResponse}</p>
              </div>
            )}
          </div>
        ))}

        {/* Current Node */}
        <div className="animate-fadeIn">
          {(currentNode.type === 'patient_speech' || currentNode.type === 'patient_action') && (
            <div className="dialogue-bubble dialogue-bubble-patient">
              <span className="text-xs text-gray-500 block mb-1">
                Patient {currentNode.patientEmotion && `(${currentNode.patientEmotion})`}
              </span>
              <p className="text-sm whitespace-pre-wrap">{currentNode.content}</p>
            </div>
          )}

          {currentNode.type === 'system_event' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mx-auto max-w-md">
              <p className="text-sm text-amber-900 text-center">{currentNode.content}</p>
            </div>
          )}

          {currentNode.type === 'decision_point' && (
            <div className="bg-clinical-50 border border-clinical-200 rounded-lg p-3 mx-auto max-w-md">
              <p className="text-sm text-clinical-900 text-center font-medium">
                {currentNode.content}
              </p>
            </div>
          )}
        </div>

        {/* Feedback Display */}
        {showFeedback && lastFeedback && (
          <div
            className={`animate-fadeIn p-4 rounded-lg border ${getAppropriatenessColor(
              lastFeedback.appropriateness
            )}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide mb-1">
              {getAppropriatenessLabel(lastFeedback.appropriateness)}
            </p>
            <p className="text-sm">{lastFeedback.text}</p>
          </div>
        )}
      </div>

      {/* Response Options */}
      {currentNode.options && currentNode.options.length > 0 && !showFeedback && (
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
          <p className="text-sm font-medium text-gray-700 mb-3">Choose your response:</p>
          <div className="space-y-2">
            {currentNode.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option)}
                disabled={selectedOption !== null}
                className={`simulation-option w-full ${
                  selectedOption === option.id ? 'simulation-option-selected' : ''
                } ${selectedOption !== null && selectedOption !== option.id ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-900 pr-2">{option.text}</p>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                      option.type === 'empathy'
                        ? 'bg-pink-100 text-pink-700'
                        : option.type === 'question'
                          ? 'bg-blue-100 text-blue-700'
                          : option.type === 'action'
                            ? 'bg-orange-100 text-orange-700'
                            : option.type === 'education'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {option.type}
                  </span>
                </div>
                {option.competencies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {option.competencies.slice(0, 2).map((comp) => (
                      <CompetencyBadge key={comp} competency={comp} size="sm" />
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Auto-advance indicator */}
      {currentNode.autoAdvance && (
        <div className="flex-shrink-0 border-t border-gray-200 p-4 bg-white">
          <p className="text-sm text-gray-500 text-center">Processing...</p>
        </div>
      )}
    </div>
  );
}
