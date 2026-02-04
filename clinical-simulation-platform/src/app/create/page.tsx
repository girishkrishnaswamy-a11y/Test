'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import {
  ClinicalRole,
  CLINICAL_ROLES,
  DifficultyLevel,
  ScenarioType,
  CompetencyCategory,
  COMPETENCY_CATEGORIES,
  PatientDemographics,
} from '@/types';

type Step = 'basics' | 'patient' | 'scenario' | 'dialogue' | 'review';

export default function CreateScenarioPage() {
  const [currentStep, setCurrentStep] = useState<Step>('basics');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [briefing, setBriefing] = useState('');
  const [targetRoles, setTargetRoles] = useState<ClinicalRole[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [scenarioType, setScenarioType] = useState<ScenarioType>('patient_encounter');
  const [estimatedDuration, setEstimatedDuration] = useState(15);
  const [competencies, setCompetencies] = useState<CompetencyCategory[]>([]);
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['']);

  // Patient state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState(45);
  const [patientGender, setPatientGender] = useState<PatientDemographics['gender']>('female');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [presentingProblem, setPresentingProblem] = useState('');
  const [medicalHistory, setMedicalHistory] = useState<string[]>(['']);
  const [medications, setMedications] = useState<string[]>(['']);
  const [allergies, setAllergies] = useState<string[]>(['']);

  const steps: { id: Step; label: string }[] = [
    { id: 'basics', label: 'Basic Info' },
    { id: 'patient', label: 'Patient Setup' },
    { id: 'scenario', label: 'Scenario Details' },
    { id: 'dialogue', label: 'Dialogue Tree' },
    { id: 'review', label: 'Review & Publish' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const toggleRole = (role: ClinicalRole) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const toggleCompetency = (comp: CompetencyCategory) => {
    setCompetencies((prev) =>
      prev.includes(comp) ? prev.filter((c) => c !== comp) : [...prev, comp]
    );
  };

  const addListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[]
  ) => {
    setter([...list, '']);
  };

  const updateListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    index: number,
    value: string
  ) => {
    const newList = [...list];
    newList[index] = value;
    setter(newList);
  };

  const removeListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    list: string[],
    index: number
  ) => {
    setter(list.filter((_, i) => i !== index));
  };

  const renderBasicsStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scenario Title *
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Emergency Department: Acute Chest Pain"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of what learners will experience..."
          rows={3}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Roles *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(CLINICAL_ROLES).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleRole(key as ClinicalRole)}
              className={`p-2 rounded-lg border text-sm text-left transition-colors ${
                targetRoles.includes(key as ClinicalRole)
                  ? 'border-clinical-600 bg-clinical-50 text-clinical-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty Level
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            className="input-field"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Scenario Type
          </label>
          <select
            value={scenarioType}
            onChange={(e) => setScenarioType(e.target.value as ScenarioType)}
            className="input-field"
          >
            <option value="patient_encounter">Patient Encounter</option>
            <option value="emergency">Emergency</option>
            <option value="procedure">Procedure</option>
            <option value="counseling">Counseling</option>
            <option value="handoff">Handoff</option>
            <option value="difficult_conversation">Difficult Conversation</option>
            <option value="team_collaboration">Team Collaboration</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Duration (min)
          </label>
          <input
            type="number"
            value={estimatedDuration}
            onChange={(e) => setEstimatedDuration(parseInt(e.target.value) || 15)}
            min={5}
            max={60}
            className="input-field"
          />
        </div>
      </div>
    </div>
  );

  const renderPatientStep = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Patient Name *
          </label>
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="e.g., John Smith"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            value={patientAge}
            onChange={(e) => setPatientAge(parseInt(e.target.value) || 45)}
            min={0}
            max={120}
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={patientGender}
            onChange={(e) =>
              setPatientGender(e.target.value as PatientDemographics['gender'])
            }
            className="input-field"
          >
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="non_binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chief Complaint *
        </label>
        <input
          type="text"
          value={chiefComplaint}
          onChange={(e) => setChiefComplaint(e.target.value)}
          placeholder="e.g., Chest pain, shortness of breath"
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Presenting Problem *
        </label>
        <textarea
          value={presentingProblem}
          onChange={(e) => setPresentingProblem(e.target.value)}
          placeholder="Detailed description of how the patient presents..."
          rows={3}
          className="input-field"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Medical History
        </label>
        {medicalHistory.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                updateListItem(setMedicalHistory, medicalHistory, i, e.target.value)
              }
              placeholder="e.g., Hypertension"
              className="input-field flex-1"
            />
            {medicalHistory.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem(setMedicalHistory, medicalHistory, i)}
                className="px-3 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(setMedicalHistory, medicalHistory)}
          className="text-sm text-clinical-600 hover:text-clinical-700"
        >
          + Add condition
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medications
        </label>
        {medications.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                updateListItem(setMedications, medications, i, e.target.value)
              }
              placeholder="e.g., Lisinopril 10mg daily"
              className="input-field flex-1"
            />
            {medications.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem(setMedications, medications, i)}
                className="px-3 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(setMedications, medications)}
          className="text-sm text-clinical-600 hover:text-clinical-700"
        >
          + Add medication
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Allergies
        </label>
        {allergies.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                updateListItem(setAllergies, allergies, i, e.target.value)
              }
              placeholder="e.g., Penicillin (rash)"
              className="input-field flex-1"
            />
            {allergies.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem(setAllergies, allergies, i)}
                className="px-3 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(setAllergies, allergies)}
          className="text-sm text-clinical-600 hover:text-clinical-700"
        >
          + Add allergy
        </button>
      </div>
    </div>
  );

  const renderScenarioStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scenario Briefing *
        </label>
        <textarea
          value={briefing}
          onChange={(e) => setBriefing(e.target.value)}
          placeholder="The context and setup the learner receives before starting..."
          rows={4}
          className="input-field"
        />
        <p className="mt-1 text-sm text-gray-500">
          This is shown to learners before they begin the simulation.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Competencies Assessed *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(COMPETENCY_CATEGORIES).map(([key, { label }]) => (
            <button
              key={key}
              type="button"
              onClick={() => toggleCompetency(key as CompetencyCategory)}
              className={`p-2 rounded-lg border text-sm text-left transition-colors ${
                competencies.includes(key as CompetencyCategory)
                  ? 'border-clinical-600 bg-clinical-50 text-clinical-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Learning Objectives *
        </label>
        {learningObjectives.map((item, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <span className="flex-shrink-0 w-6 h-10 flex items-center justify-center text-sm text-gray-500">
              {i + 1}.
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) =>
                updateListItem(
                  setLearningObjectives,
                  learningObjectives,
                  i,
                  e.target.value
                )
              }
              placeholder="What learners should be able to do after completing this scenario"
              className="input-field flex-1"
            />
            {learningObjectives.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  removeListItem(setLearningObjectives, learningObjectives, i)
                }
                className="px-3 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(setLearningObjectives, learningObjectives)}
          className="text-sm text-clinical-600 hover:text-clinical-700 ml-8"
        >
          + Add objective
        </button>
      </div>
    </div>
  );

  const renderDialogueStep = () => (
    <div className="space-y-6">
      <div className="bg-clinical-50 border border-clinical-200 rounded-lg p-6 text-center">
        <div className="w-16 h-16 bg-clinical-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-clinical-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-clinical-900 mb-2">
          Dialogue Tree Builder
        </h3>
        <p className="text-clinical-700 mb-4">
          The visual dialogue tree builder allows you to create branching conversations
          with patient responses, clinical actions, and assessment points.
        </p>
        <p className="text-sm text-clinical-600">
          This feature is coming soon! For now, you can define the basic structure and
          our team will help you build out the dialogue.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Dialogue Structure Preview</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <span className="w-4 h-4 bg-gray-300 rounded mr-2"></span>
            <span className="text-gray-600">Opening patient statement</span>
          </div>
          <div className="flex items-center ml-6">
            <span className="w-4 h-4 bg-clinical-400 rounded mr-2"></span>
            <span className="text-gray-600">Response option 1 (optimal)</span>
          </div>
          <div className="flex items-center ml-6">
            <span className="w-4 h-4 bg-yellow-400 rounded mr-2"></span>
            <span className="text-gray-600">Response option 2 (acceptable)</span>
          </div>
          <div className="flex items-center ml-6">
            <span className="w-4 h-4 bg-red-400 rounded mr-2"></span>
            <span className="text-gray-600">Response option 3 (suboptimal)</span>
          </div>
          <div className="flex items-center ml-4">
            <span className="w-4 h-4 bg-gray-300 rounded mr-2"></span>
            <span className="text-gray-600">Follow-up patient response...</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-900 mb-2">Ready to Review</h3>
        <p className="text-green-800 text-sm">
          Review your scenario details below. You can go back to any step to make changes.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Basic Information</h4>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Title</dt>
              <dd className="text-gray-900">{title || '(Not set)'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Difficulty</dt>
              <dd className="text-gray-900 capitalize">{difficulty}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Duration</dt>
              <dd className="text-gray-900">{estimatedDuration} minutes</dd>
            </div>
            <div>
              <dt className="text-gray-500">Target Roles</dt>
              <dd className="text-gray-900">
                {targetRoles.length > 0
                  ? targetRoles.map((r) => CLINICAL_ROLES[r].label).join(', ')
                  : '(None selected)'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Patient Information</h4>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-gray-500">Name</dt>
              <dd className="text-gray-900">{patientName || '(Not set)'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Age/Gender</dt>
              <dd className="text-gray-900 capitalize">
                {patientAge} years old, {patientGender}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Chief Complaint</dt>
              <dd className="text-gray-900">{chiefComplaint || '(Not set)'}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Competencies</h4>
        <div className="flex flex-wrap gap-2">
          {competencies.length > 0 ? (
            competencies.map((c) => (
              <span
                key={c}
                className="px-2 py-1 bg-clinical-100 text-clinical-700 rounded-full text-sm"
              >
                {COMPETENCY_CATEGORIES[c].label}
              </span>
            ))
          ) : (
            <span className="text-gray-500 text-sm">(None selected)</span>
          )}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2">Learning Objectives</h4>
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {learningObjectives.filter((o) => o).length > 0 ? (
            learningObjectives
              .filter((o) => o)
              .map((obj, i) => <li key={i}>{obj}</li>)
          ) : (
            <li className="text-gray-500">(None added)</li>
          )}
        </ul>
      </div>

      <div className="pt-4 border-t">
        <button className="btn-primary w-full" disabled>
          Save as Draft (Coming Soon)
        </button>
        <p className="text-center text-sm text-gray-500 mt-2">
          Full scenario publishing will be available in a future update.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Scenario</h1>
          <p className="text-gray-600">
            Build custom clinical simulations for your learners
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex items-center ${
                    index <= currentStepIndex ? 'text-clinical-600' : 'text-gray-400'
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < currentStepIndex
                        ? 'bg-clinical-600 text-white'
                        : index === currentStepIndex
                          ? 'bg-clinical-100 text-clinical-600 border-2 border-clinical-600'
                          : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? '✓' : index + 1}
                  </span>
                  <span className="ml-2 text-sm font-medium hidden sm:inline">
                    {step.label}
                  </span>
                </button>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 sm:w-24 h-0.5 mx-2 ${
                      index < currentStepIndex ? 'bg-clinical-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="card">
          <div className="card-header">
            <h2 className="font-semibold text-gray-900">
              {steps.find((s) => s.id === currentStep)?.label}
            </h2>
          </div>
          <div className="card-body">
            {currentStep === 'basics' && renderBasicsStep()}
            {currentStep === 'patient' && renderPatientStep()}
            {currentStep === 'scenario' && renderScenarioStep()}
            {currentStep === 'dialogue' && renderDialogueStep()}
            {currentStep === 'review' && renderReviewStep()}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => setCurrentStep(steps[currentStepIndex - 1]?.id || 'basics')}
                disabled={currentStepIndex === 0}
                className="btn-secondary disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentStep(
                    steps[currentStepIndex + 1]?.id || steps[steps.length - 1].id
                  )
                }
                disabled={currentStepIndex === steps.length - 1}
                className="btn-primary disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
