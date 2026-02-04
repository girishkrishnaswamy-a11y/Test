'use client';

import { ClinicalRole, CLINICAL_ROLES } from '@/types';

interface RoleSelectorProps {
  selectedRole: ClinicalRole | null;
  onRoleSelect: (role: ClinicalRole) => void;
  compact?: boolean;
}

const roleIcons: Record<ClinicalRole, string> = {
  medical_assistant: '🩺',
  registered_nurse: '💉',
  nurse_practitioner: '👩‍⚕️',
  physician_assistant: '👨‍⚕️',
  er_physician: '🚨',
  primary_care_physician: '🏥',
  specialist: '🔬',
  pharmacist: '💊',
  paramedic: '🚑',
};

export function RoleSelector({ selectedRole, onRoleSelect, compact = false }: RoleSelectorProps) {
  if (compact) {
    return (
      <select
        value={selectedRole || ''}
        onChange={(e) => onRoleSelect(e.target.value as ClinicalRole)}
        className="input-field"
      >
        <option value="">All Roles</option>
        {Object.entries(CLINICAL_ROLES).map(([key, { label }]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(CLINICAL_ROLES).map(([key, { label, description }]) => (
        <button
          key={key}
          onClick={() => onRoleSelect(key as ClinicalRole)}
          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
            selectedRole === key
              ? 'border-clinical-600 bg-clinical-50 shadow-md'
              : 'border-gray-200 hover:border-clinical-400 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-start space-x-3">
            <span className="text-2xl">{roleIcons[key as ClinicalRole]}</span>
            <div>
              <h3 className="font-semibold text-gray-900">{label}</h3>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
