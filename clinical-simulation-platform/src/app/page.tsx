'use client';

import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { CLINICAL_ROLES, COMPETENCY_CATEGORIES } from '@/types';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-clinical-600 to-clinical-800 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zNHY2aDZ2LTZoLTZ6bTAgMTd2Nmg2di02aC02ek0xOSAxN3Y2aDZ2LTZoLTZ6bTAgMTd2Nmg2di02aC02em0wLTE3djZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Master Clinical Skills Through{' '}
              <span className="text-clinical-200">Immersive Simulation</span>
            </h1>
            <p className="text-xl text-clinical-100 mb-8 leading-relaxed">
              Practice patient encounters, develop clinical reasoning, and build empathetic
              communication skills in a safe, realistic learning environment designed for
              healthcare professionals.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/scenarios" className="btn-primary bg-white text-clinical-700 hover:bg-clinical-50 px-6 py-3 text-lg">
                Explore Scenarios
              </Link>
              <Link href="/dashboard" className="btn-secondary bg-clinical-700 text-white border-clinical-500 hover:bg-clinical-600 px-6 py-3 text-lg">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Clinical Training
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform offers a complete suite of tools for clinical education and
              competency assessment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-clinical-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-clinical-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Role-Based Learning</h3>
              <p className="text-gray-600">
                Scenarios tailored for every clinical role, from medical assistants to
                emergency physicians.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-success-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competency Tracking</h3>
              <p className="text-gray-600">
                Measure progress across 10 core competencies with detailed feedback and
                personalized recommendations.
              </p>
            </div>

            <div className="card p-6 text-center">
              <div className="w-14 h-14 bg-warning-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Empathy & Communication</h3>
              <p className="text-gray-600">
                Practice delivering compassionate care with realistic patient interactions
                and emotional responses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clinical Roles Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Designed for Every Clinical Role
            </h2>
            <p className="text-xl text-gray-600">
              Select your role to access tailored learning experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(CLINICAL_ROLES).slice(0, 5).map(([key, { label }]) => (
              <Link
                key={key}
                href={`/scenarios?role=${key}`}
                className="card p-4 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">
                  {key === 'medical_assistant' && '🩺'}
                  {key === 'registered_nurse' && '💉'}
                  {key === 'nurse_practitioner' && '👩‍⚕️'}
                  {key === 'physician_assistant' && '👨‍⚕️'}
                  {key === 'er_physician' && '🚨'}
                </div>
                <h3 className="font-medium text-gray-900 text-sm">{label}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Competencies Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              10 Core Clinical Competencies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our simulations assess and develop essential skills that define excellent
              clinical practice.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(COMPETENCY_CATEGORIES).map(([key, { label, description }]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{label}</h3>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-clinical-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Enhance Your Clinical Skills?
          </h2>
          <p className="text-xl text-clinical-100 mb-8">
            Join healthcare professionals who are using simulation to become better
            clinicians.
          </p>
          <Link href="/scenarios" className="btn-primary bg-white text-clinical-700 hover:bg-clinical-50 px-8 py-3 text-lg">
            Start Learning Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-clinical-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-white font-bold">ClinicalSim</span>
            </div>
            <p className="text-sm">
              Clinical Simulation Platform for Healthcare Education
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
