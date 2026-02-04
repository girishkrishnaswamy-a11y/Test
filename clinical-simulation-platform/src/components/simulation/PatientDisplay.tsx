'use client';

import { PatientDemographics, PatientState, VitalSigns } from '@/types';

interface PatientDisplayProps {
  demographics: PatientDemographics;
  state: PatientState;
  chiefComplaint: string;
  patientTrust: number;
}

export function PatientDisplay({
  demographics,
  state,
  chiefComplaint,
  patientTrust,
}: PatientDisplayProps) {
  const getEmotionEmoji = (emotion: PatientState['emotionalState']) => {
    const emojis = {
      calm: '😊',
      anxious: '😟',
      distressed: '😰',
      angry: '😠',
      confused: '😕',
      withdrawn: '😔',
    };
    return emojis[emotion];
  };

  const getTrustColor = (trust: number) => {
    if (trust >= 70) return 'text-green-600';
    if (trust >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Patient Information</h2>
          <span className="text-2xl">{getEmotionEmoji(state.emotionalState)}</span>
        </div>
      </div>
      <div className="card-body space-y-4">
        {/* Patient Avatar and Basic Info */}
        <div className="flex items-center space-x-4">
          <div className={`w-16 h-16 rounded-full bg-clinical-100 flex items-center justify-center text-2xl ${state.emotionalState === 'distressed' ? 'speaking' : ''}`}>
            {demographics.gender === 'male' ? '👨' : demographics.gender === 'female' ? '👩' : '🧑'}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{demographics.name}</h3>
            <p className="text-sm text-gray-600">
              {demographics.age} years old, {demographics.pronouns}
            </p>
            {demographics.occupation && (
              <p className="text-sm text-gray-500">{demographics.occupation}</p>
            )}
          </div>
        </div>

        {/* Chief Complaint */}
        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
          <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-1">
            Chief Complaint
          </p>
          <p className="text-sm text-red-900">{chiefComplaint}</p>
        </div>

        {/* Patient Trust */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Patient Trust</span>
            <span className={`text-sm font-medium ${getTrustColor(patientTrust)}`}>
              {patientTrust}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                patientTrust >= 70
                  ? 'bg-green-500'
                  : patientTrust >= 40
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
              }`}
              style={{ width: `${patientTrust}%` }}
            />
          </div>
        </div>

        {/* Current State */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Emotional State</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {state.emotionalState}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Cooperation</p>
            <p className="text-sm font-medium text-gray-900 capitalize">
              {state.cooperationLevel}
            </p>
          </div>
        </div>

        {/* Current Symptoms */}
        {state.symptoms.length > 0 && (
          <div>
            <p className="text-xs text-gray-500 mb-2">Active Symptoms</p>
            <div className="flex flex-wrap gap-1">
              {state.symptoms.map((symptom, i) => (
                <span
                  key={i}
                  className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full"
                >
                  {symptom}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface VitalSignsDisplayProps {
  vitals: VitalSigns;
  compact?: boolean;
}

export function VitalSignsDisplay({ vitals, compact = false }: VitalSignsDisplayProps) {
  const isAbnormal = (type: string, value: number) => {
    const ranges: Record<string, [number, number]> = {
      systolic: [90, 140],
      diastolic: [60, 90],
      heartRate: [60, 100],
      respiratoryRate: [12, 20],
      temperature: [97, 99.5],
      oxygenSaturation: [95, 100],
    };
    const range = ranges[type];
    if (!range) return false;
    return value < range[0] || value > range[1];
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {vitals.bloodPressure && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              isAbnormal('systolic', vitals.bloodPressure.systolic)
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            BP: {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
          </span>
        )}
        {vitals.heartRate && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              isAbnormal('heartRate', vitals.heartRate)
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            HR: {vitals.heartRate}
          </span>
        )}
        {vitals.oxygenSaturation && (
          <span
            className={`text-xs px-2 py-1 rounded ${
              isAbnormal('oxygenSaturation', vitals.oxygenSaturation)
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            SpO2: {vitals.oxygenSaturation}%
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="font-semibold text-gray-900">Vital Signs</h2>
      </div>
      <div className="card-body">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {vitals.bloodPressure && (
            <div
              className={`vital-card ${
                isAbnormal('systolic', vitals.bloodPressure.systolic)
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            >
              <p className="vital-value">
                {vitals.bloodPressure.systolic}/{vitals.bloodPressure.diastolic}
              </p>
              <p className="vital-label">Blood Pressure</p>
            </div>
          )}

          {vitals.heartRate && (
            <div
              className={`vital-card ${
                isAbnormal('heartRate', vitals.heartRate) ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              <p className="vital-value">{vitals.heartRate}</p>
              <p className="vital-label">Heart Rate</p>
            </div>
          )}

          {vitals.respiratoryRate && (
            <div
              className={`vital-card ${
                isAbnormal('respiratoryRate', vitals.respiratoryRate)
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            >
              <p className="vital-value">{vitals.respiratoryRate}</p>
              <p className="vital-label">Resp Rate</p>
            </div>
          )}

          {vitals.temperature && (
            <div
              className={`vital-card ${
                isAbnormal('temperature', vitals.temperature)
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            >
              <p className="vital-value">{vitals.temperature}°F</p>
              <p className="vital-label">Temperature</p>
            </div>
          )}

          {vitals.oxygenSaturation && (
            <div
              className={`vital-card ${
                isAbnormal('oxygenSaturation', vitals.oxygenSaturation)
                  ? 'border-red-300 bg-red-50'
                  : ''
              }`}
            >
              <p className="vital-value">{vitals.oxygenSaturation}%</p>
              <p className="vital-label">SpO2</p>
            </div>
          )}

          {vitals.painLevel !== undefined && (
            <div
              className={`vital-card ${
                vitals.painLevel >= 7 ? 'border-red-300 bg-red-50' : ''
              }`}
            >
              <p className="vital-value">{vitals.painLevel}/10</p>
              <p className="vital-label">Pain Level</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
