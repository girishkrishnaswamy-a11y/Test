'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulation-store';
import { getScenarioById, scenarios } from '@/data/scenarios';
import { Header } from '@/components/layout/Header';
import { CompetencyProgress } from '@/components/ui/CompetencyBadge';
import { COMPETENCY_CATEGORIES, CLINICAL_ROLES, CompetencyCategory } from '@/types';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { user, learningProgress, completedSessions } = useSimulationStore();

  const recentResults = useMemo(
    () => completedSessions.slice(-5).reverse(),
    [completedSessions]
  );

  const suggestedScenarios = useMemo(() => {
    if (!user) return scenarios.slice(0, 3);

    // Get scenarios matching user's role that haven't been completed
    const completedIds = completedSessions.map((s) => s.scenarioId);
    return scenarios
      .filter(
        (s) =>
          s.targetRoles.includes(user.role) && !completedIds.includes(s.id)
      )
      .slice(0, 3);
  }, [user, completedSessions]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins} minutes`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {user ? `Welcome back, ${user.name}` : 'Learning Dashboard'}
          </h1>
          <p className="text-gray-600">
            {user
              ? `Track your progress and continue developing your clinical skills as a ${CLINICAL_ROLES[user.role]?.label}.`
              : 'Start a simulation to track your learning progress.'}
          </p>
        </div>

        {/* Stats Overview */}
        {learningProgress && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card p-6">
              <p className="text-3xl font-bold text-clinical-600">
                {learningProgress.completedScenarios.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Scenarios Completed</p>
            </div>
            <div className="card p-6">
              <p className="text-3xl font-bold text-clinical-600">
                {formatTime(learningProgress.totalSimulationTime)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total Practice Time</p>
            </div>
            <div className="card p-6">
              <p className="text-3xl font-bold text-clinical-600">
                {Math.round(learningProgress.averageScore)}%
              </p>
              <p className="text-sm text-gray-500 mt-1">Average Score</p>
            </div>
            <div className="card p-6">
              <p className="text-3xl font-bold text-clinical-600">
                {learningProgress.achievements.length}
              </p>
              <p className="text-sm text-gray-500 mt-1">Achievements</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Competency Progress */}
            {learningProgress && (
              <div className="card">
                <div className="card-header">
                  <h2 className="font-semibold text-gray-900">Competency Development</h2>
                </div>
                <div className="card-body">
                  <div className="grid md:grid-cols-2 gap-6">
                    {Object.entries(learningProgress.competencyProgress)
                      .filter(([, data]) => data.totalAttempts > 0)
                      .map(([key, data]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-900">
                              {COMPETENCY_CATEGORIES[key as CompetencyCategory].label}
                            </span>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  data.trend === 'improving'
                                    ? 'bg-green-100 text-green-700'
                                    : data.trend === 'declining'
                                      ? 'bg-red-100 text-red-700'
                                      : 'bg-gray-100 text-gray-700'
                                }`}
                              >
                                {data.trend === 'improving'
                                  ? '↑'
                                  : data.trend === 'declining'
                                    ? '↓'
                                    : '→'}
                              </span>
                              <span className="text-sm font-bold text-gray-900">
                                Lvl {data.level}
                              </span>
                            </div>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-clinical-500 rounded-full transition-all duration-500"
                              style={{ width: `${data.averageScore}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500">
                            {data.totalAttempts} attempts · {Math.round(data.averageScore)}% avg
                          </p>
                        </div>
                      ))}
                  </div>

                  {Object.values(learningProgress.competencyProgress).every(
                    (d) => d.totalAttempts === 0
                  ) && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Complete simulations to see your competency progress</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-gray-900">Recent Activity</h2>
              </div>
              <div className="card-body">
                {recentResults.length > 0 ? (
                  <div className="space-y-4">
                    {recentResults.map((result) => {
                      const scenario = getScenarioById(result.scenarioId);
                      if (!scenario) return null;

                      return (
                        <Link
                          key={result.id}
                          href={`/assessment/${result.id}`}
                          className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{scenario.title}</h3>
                            <span
                              className={`text-sm font-bold ${
                                result.passed ? 'text-green-600' : 'text-orange-600'
                              }`}
                            >
                              {result.overallScore}%
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span>
                              {format(new Date(result.completedAt), 'MMM d, yyyy')}
                            </span>
                            <span>
                              {Math.floor(result.timeSpent / 60)}m{' '}
                              {result.timeSpent % 60}s
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-xs ${
                                result.passed
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`}
                            >
                              {result.passed ? 'Passed' : 'Needs Practice'}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No completed simulations yet</p>
                    <Link href="/scenarios" className="btn-primary mt-4 inline-block">
                      Start Your First Simulation
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Suggested Scenarios */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-gray-900">Suggested for You</h2>
              </div>
              <div className="card-body space-y-4">
                {suggestedScenarios.map((scenario) => (
                  <Link
                    key={scenario.id}
                    href={`/simulation/${scenario.id}`}
                    className="block p-3 bg-gray-50 rounded-lg hover:bg-clinical-50 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 text-sm mb-1">
                      {scenario.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 space-x-2">
                      <span className="capitalize">{scenario.difficulty}</span>
                      <span>·</span>
                      <span>{scenario.estimatedDuration} min</span>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/scenarios"
                  className="block text-center text-sm text-clinical-600 hover:text-clinical-700 font-medium pt-2"
                >
                  View All Scenarios →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-gray-900">Quick Actions</h2>
              </div>
              <div className="card-body space-y-3">
                <Link
                  href="/scenarios"
                  className="flex items-center p-3 bg-clinical-50 rounded-lg hover:bg-clinical-100 transition-colors"
                >
                  <span className="w-10 h-10 bg-clinical-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-clinical-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Start Simulation</p>
                    <p className="text-xs text-gray-500">Practice clinical scenarios</p>
                  </div>
                </Link>

                <Link
                  href="/create"
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Create Scenario</p>
                    <p className="text-xs text-gray-500">Build custom simulations</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Learning Tips */}
            <div className="card bg-gradient-to-br from-clinical-50 to-clinical-100 border-clinical-200">
              <div className="card-body">
                <h3 className="font-semibold text-clinical-900 mb-2">Learning Tip</h3>
                <p className="text-sm text-clinical-800">
                  Consistent practice is key! Aim to complete at least 2-3 simulations per
                  week to build and maintain your clinical competencies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
