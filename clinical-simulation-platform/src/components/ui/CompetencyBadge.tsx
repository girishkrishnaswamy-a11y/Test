'use client';

import { CompetencyCategory, COMPETENCY_CATEGORIES } from '@/types';

interface CompetencyBadgeProps {
  competency: CompetencyCategory;
  size?: 'sm' | 'md';
  showTooltip?: boolean;
}

const competencyColors: Record<CompetencyCategory, string> = {
  clinical_knowledge: 'bg-blue-100 text-blue-800',
  patient_communication: 'bg-green-100 text-green-800',
  clinical_reasoning: 'bg-purple-100 text-purple-800',
  procedural_skills: 'bg-orange-100 text-orange-800',
  empathy_compassion: 'bg-pink-100 text-pink-800',
  professionalism: 'bg-indigo-100 text-indigo-800',
  teamwork: 'bg-teal-100 text-teal-800',
  safety_quality: 'bg-red-100 text-red-800',
  documentation: 'bg-gray-100 text-gray-800',
  cultural_competence: 'bg-amber-100 text-amber-800',
};

export function CompetencyBadge({
  competency,
  size = 'sm',
  showTooltip = true,
}: CompetencyBadgeProps) {
  const { label } = COMPETENCY_CATEGORIES[competency];
  const colorClass = competencyColors[competency];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${colorClass} ${sizeClass}`}
      title={showTooltip ? COMPETENCY_CATEGORIES[competency].description : undefined}
    >
      {label}
    </span>
  );
}

interface CompetencyProgressProps {
  competency: CompetencyCategory;
  score: number;
  maxScore?: number;
  showLabel?: boolean;
}

export function CompetencyProgress({
  competency,
  score,
  maxScore = 100,
  showLabel = true,
}: CompetencyProgressProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const { label } = COMPETENCY_CATEGORIES[competency];

  const getBarColor = (pct: number) => {
    if (pct >= 80) return 'bg-green-500';
    if (pct >= 60) return 'bg-clinical-500';
    if (pct >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700">{label}</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="competency-bar">
        <div
          className={`competency-fill ${getBarColor(percentage)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
