'use client';

import { DifficultyLevel } from '@/types';

interface DifficultyBadgeProps {
  difficulty: DifficultyLevel;
}

const difficultyConfig: Record<
  DifficultyLevel,
  { label: string; color: string; icon: string }
> = {
  beginner: {
    label: 'Beginner',
    color: 'bg-green-100 text-green-800',
    icon: '●',
  },
  intermediate: {
    label: 'Intermediate',
    color: 'bg-yellow-100 text-yellow-800',
    icon: '●●',
  },
  advanced: {
    label: 'Advanced',
    color: 'bg-orange-100 text-orange-800',
    icon: '●●●',
  },
  expert: {
    label: 'Expert',
    color: 'bg-red-100 text-red-800',
    icon: '●●●●',
  },
};

export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  const config = difficultyConfig[difficulty];

  return (
    <span
      className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
    >
      <span className="text-[8px] tracking-tighter">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
