'use client';

import { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSimulationStore } from '@/store/simulation-store';
import { getScenarioById } from '@/data/scenarios';
import { Header } from '@/components/layout/Header';
import { CompetencyProgress } from '@/components/ui/CompetencyBadge';
import { COMPETENCY_CATEGORIES, CompetencyCategory } from '@/types';

export default function AssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const { completedSessions } = useSimulationStore();

  const result = useMemo(
    () => completedSessions.find((s) => s.id === assessmentId),
    [completedSessions, assessmentId]
  );

  const scenario = useMemo(
    () => (result ? getScenarioById(result.scenarioId) : null),
    [result]
  );

  if (!result || !scenario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Assessment Not Found</h1>
          <p className="text-gray-600 mb-8">
            The assessment results you're looking for don't exist or have expired.
          </p>
          <button onClick={() => router.push('/scenarios')} className="btn-primary">
            Browse Scenarios
          </button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Result Header */}
        <div className="card mb-8">
          <div
            className={`p-8 text-center ${
              result.passed
                ? 'bg-gradient-to-br from-green-500 to-green-600'
                : 'bg-gradient-to-br from-orange-500 to-orange-600'
            } text-white rounded-t-xl`}
          >
            <div className="mb-4">
              {result.passed ? (
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {result.passed ? 'Simulation Completed!' : 'Keep Practicing'}
            </h1>
            <p className="text-white/90 mb-4">{scenario.title}</p>

            {/* Score Circle */}
            <div className="inline-flex items-center justify-center">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 progress-ring" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="white"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${result.overallScore * 2.83} 283`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{result.overallScore}%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card-body">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{formatTime(result.timeSpent)}</p>
                <p className="text-sm text-gray-500">Time Spent</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{result.strengths.length}</p>
                <p className="text-sm text-gray-500">Strengths</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {result.areasForImprovement.length}
                </p>
                <p className="text-sm text-gray-500">Areas to Improve</p>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Overall Feedback</h3>
              <p className="text-gray-700">{result.detailedFeedback}</p>
            </div>
          </div>
        </div>

        {/* Competency Scores */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Competency Assessment</h2>
          </div>
          <div className="card-body">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(result.competencyScores).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {COMPETENCY_CATEGORIES[key as CompetencyCategory].label}
                    </span>
                    <span
                      className={`text-sm font-bold ${
                        value.percentage >= 80
                          ? 'text-green-600'
                          : value.percentage >= 60
                            ? 'text-yellow-600'
                            : 'text-red-600'
                      }`}
                    >
                      {Math.round(value.percentage)}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        value.percentage >= 80
                          ? 'bg-green-500'
                          : value.percentage >= 60
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      }`}
                      style={{ width: `${value.percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">{value.feedback}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Strengths & Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <div className="card-header bg-green-50">
              <h2 className="font-semibold text-green-900">Strengths</h2>
            </div>
            <div className="card-body">
              {result.strengths.length > 0 ? (
                <ul className="space-y-2">
                  {result.strengths.map((strength, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700 capitalize">{strength}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  Complete more of the simulation to identify strengths.
                </p>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header bg-orange-50">
              <h2 className="font-semibold text-orange-900">Areas for Improvement</h2>
            </div>
            <div className="card-body">
              {result.areasForImprovement.length > 0 ? (
                <ul className="space-y-2">
                  {result.areasForImprovement.map((area, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-orange-500 mr-2">→</span>
                      <span className="text-gray-700 capitalize">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">
                  Excellent work! No major areas for improvement identified.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Recommendations</h2>
          </div>
          <div className="card-body">
            <ul className="space-y-3">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-clinical-100 text-clinical-700 flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Debriefing */}
        <div className="card mb-8">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">Scenario Debriefing</h2>
          </div>
          <div className="card-body space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Key Learning Points</h3>
              <ul className="space-y-2">
                {scenario.debriefing.keyLearningPoints.map((point, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-clinical-600 mr-2">•</span>
                    <span className="text-gray-700">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Common Mistakes to Avoid</h3>
              <ul className="space-y-2">
                {scenario.debriefing.commonMistakes.map((mistake, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-red-500 mr-2">✗</span>
                    <span className="text-gray-700">{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Best Practices</h3>
              <ul className="space-y-2">
                {scenario.debriefing.bestPractices.map((practice, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{practice}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/simulation/${scenario.id}`} className="btn-primary text-center">
            Retry This Scenario
          </Link>
          <Link href="/scenarios" className="btn-secondary text-center">
            Try Another Scenario
          </Link>
          <Link href="/dashboard" className="btn-secondary text-center">
            View Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
