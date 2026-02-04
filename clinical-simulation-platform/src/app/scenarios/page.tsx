'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { ScenarioCard } from '@/components/scenarios/ScenarioCard';
import { RoleSelector } from '@/components/ui/RoleSelector';
import { scenarios } from '@/data/scenarios';
import { ClinicalRole, DifficultyLevel, CompetencyCategory, COMPETENCY_CATEGORIES } from '@/types';

export default function ScenariosPage() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') as ClinicalRole | null;

  const [selectedRole, setSelectedRole] = useState<ClinicalRole | null>(initialRole);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);
  const [selectedCompetency, setSelectedCompetency] = useState<CompetencyCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      // Role filter
      if (selectedRole && !scenario.targetRoles.includes(selectedRole)) {
        return false;
      }

      // Difficulty filter
      if (selectedDifficulty && scenario.difficulty !== selectedDifficulty) {
        return false;
      }

      // Competency filter
      if (selectedCompetency && !scenario.competencies.includes(selectedCompetency)) {
        return false;
      }

      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          scenario.title.toLowerCase().includes(query) ||
          scenario.description.toLowerCase().includes(query) ||
          scenario.patient.chiefComplaint.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedRole, selectedDifficulty, selectedCompetency, searchQuery]);

  const clearFilters = () => {
    setSelectedRole(null);
    setSelectedDifficulty(null);
    setSelectedCompetency(null);
    setSearchQuery('');
  };

  const hasFilters = selectedRole || selectedDifficulty || selectedCompetency || searchQuery;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Scenario Library</h1>
          <p className="text-gray-600">
            Browse and select clinical scenarios to practice your skills
          </p>
        </div>

        {/* Filters */}
        <div className="card mb-8">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search scenarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Role Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Clinical Role
                </label>
                <RoleSelector
                  selectedRole={selectedRole}
                  onRoleSelect={(role) =>
                    setSelectedRole(role === selectedRole ? null : role)
                  }
                  compact
                />
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={selectedDifficulty || ''}
                  onChange={(e) =>
                    setSelectedDifficulty(
                      e.target.value ? (e.target.value as DifficultyLevel) : null
                    )
                  }
                  className="input-field"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Competency Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Competency Focus
                </label>
                <select
                  value={selectedCompetency || ''}
                  onChange={(e) =>
                    setSelectedCompetency(
                      e.target.value ? (e.target.value as CompetencyCategory) : null
                    )
                  }
                  className="input-field"
                >
                  <option value="">All Competencies</option>
                  {Object.entries(COMPETENCY_CATEGORIES).map(([key, { label }]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {hasFilters && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {filteredScenarios.length} of {scenarios.length} scenarios
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-clinical-600 hover:text-clinical-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Scenarios Grid */}
        {filteredScenarios.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScenarios.map((scenario) => (
              <ScenarioCard key={scenario.id} scenario={scenario} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No scenarios found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters or search query
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
