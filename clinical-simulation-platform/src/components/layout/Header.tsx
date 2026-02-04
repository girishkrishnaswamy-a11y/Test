'use client';

import Link from 'next/link';
import { useSimulationStore } from '@/store/simulation-store';
import { CLINICAL_ROLES } from '@/types';

export function Header() {
  const { user, setUser, learningProgress } = useSimulationStore();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-clinical-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">ClinicalSim</span>
            </Link>

            <nav className="hidden md:flex space-x-6">
              <Link
                href="/scenarios"
                className="text-gray-600 hover:text-clinical-600 font-medium transition-colors"
              >
                Scenarios
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-clinical-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="text-gray-600 hover:text-clinical-600 font-medium transition-colors"
              >
                Create
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {learningProgress && (
                  <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
                    <span className="badge badge-success">
                      {learningProgress.completedScenarios.length} completed
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-clinical-100 rounded-full flex items-center justify-center">
                    <span className="text-clinical-700 font-medium text-sm">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">
                      {CLINICAL_ROLES[user.role]?.label}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setUser(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link href="/scenarios" className="btn-primary text-sm">
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
