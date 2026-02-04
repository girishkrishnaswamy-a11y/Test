'use client';

import Link from 'next/link';
import { ClinicalScenario, CLINICAL_ROLES } from '@/types';
import { DifficultyBadge } from '@/components/ui/DifficultyBadge';
import { CompetencyBadge } from '@/components/ui/CompetencyBadge';

interface ScenarioCardProps {
  scenario: ClinicalScenario;
}

export function ScenarioCard({ scenario }: ScenarioCardProps) {
  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="card-body">
        <div className="flex items-start justify-between mb-3">
          <DifficultyBadge difficulty={scenario.difficulty} />
          <span className="text-sm text-gray-500">
            ~{scenario.estimatedDuration} min
          </span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {scenario.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {scenario.description}
        </p>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Target Roles:</p>
          <div className="flex flex-wrap gap-1">
            {scenario.targetRoles.slice(0, 3).map((role) => (
              <span
                key={role}
                className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
              >
                {CLINICAL_ROLES[role]?.label}
              </span>
            ))}
            {scenario.targetRoles.length > 3 && (
              <span className="text-xs text-gray-500">
                +{scenario.targetRoles.length - 3} more
              </span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2">Key Competencies:</p>
          <div className="flex flex-wrap gap-1">
            {scenario.competencies.slice(0, 3).map((comp) => (
              <CompetencyBadge key={comp} competency={comp} size="sm" />
            ))}
            {scenario.competencies.length > 3 && (
              <span className="text-xs text-gray-500 self-center">
                +{scenario.competencies.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <Link
            href={`/simulation/${scenario.id}`}
            className="btn-primary w-full text-center block"
          >
            Start Simulation
          </Link>
        </div>
      </div>
    </div>
  );
}

export function ScenarioCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="card-body">
        <div className="flex items-start justify-between mb-3">
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-6 w-3/4 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-full bg-gray-200 rounded mb-2" />
        <div className="h-4 w-2/3 bg-gray-200 rounded mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-24 bg-gray-200 rounded-full" />
        </div>
        <div className="h-10 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}
