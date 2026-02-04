'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSimulationStore } from '@/store/simulation-store';
import { getScenarioById } from '@/data/scenarios';
import { Header } from '@/components/layout/Header';
import { PatientDisplay, VitalSignsDisplay } from '@/components/simulation/PatientDisplay';
import { DialoguePanel } from '@/components/simulation/DialoguePanel';
import { ActionPanel } from '@/components/simulation/ActionPanel';
import { CompetencyProgress } from '@/components/ui/CompetencyBadge';
import { ClinicalRole, CLINICAL_ROLES, CompetencyCategory } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function SimulationPage() {
  const params = useParams();
  const router = useRouter();
  const scenarioId = params.id as string;

  const {
    user,
    setUser,
    currentSession,
    currentScenario,
    startSimulation,
    endSimulation,
    selectDialogueOption,
    performAction,
    advanceToNode,
    getCurrentNode,
    getCurrentPhase,
  } = useSimulationStore();

  const [showBriefing, setShowBriefing] = useState(true);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [quickSetupRole, setQuickSetupRole] = useState<ClinicalRole>('registered_nurse');

  const scenario = useMemo(() => getScenarioById(scenarioId), [scenarioId]);
  const currentNode = getCurrentNode();
  const currentPhase = getCurrentPhase();

  // Timer
  useEffect(() => {
    if (!currentSession || showBriefing) return;

    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentSession, showBriefing]);

  // Auto-advance for system events
  useEffect(() => {
    if (!currentNode?.autoAdvance || !currentNode.nextNodeId) return;

    const timeout = setTimeout(() => {
      advanceToNode(currentNode.nextNodeId!);
    }, currentNode.autoAdvanceDelay || 2000);

    return () => clearTimeout(timeout);
  }, [currentNode, advanceToNode]);

  // Build dialogue history
  const dialogueHistory = useMemo(() => {
    if (!currentSession || !currentScenario) return [];

    const history: Array<{
      nodeContent: string;
      selectedResponse?: string;
      isPatient: boolean;
    }> = [];

    const currentPhaseObj = currentScenario.phases.find(
      (p) => p.id === currentSession.currentPhaseId
    );
    if (!currentPhaseObj) return history;

    for (const entry of currentSession.dialogueHistory) {
      const node = currentPhaseObj.dialogueNodes.find((n) => n.id === entry.nodeId);
      if (!node) continue;

      if (node.type === 'patient_speech' || node.type === 'patient_action') {
        const selectedOption = entry.selectedOptionId
          ? node.options?.find((o) => o.id === entry.selectedOptionId)
          : undefined;

        history.push({
          nodeContent: node.content,
          selectedResponse: selectedOption?.text,
          isPatient: true,
        });
      }
    }

    return history;
  }, [currentSession, currentScenario]);

  const handleStartSimulation = useCallback(() => {
    if (!scenario) return;

    // Quick setup: create a temp user if not logged in
    if (!user) {
      setUser({
        id: uuidv4(),
        name: 'Learner',
        email: 'learner@example.com',
        role: quickSetupRole,
        createdAt: new Date().toISOString(),
      });
    }

    startSimulation(scenario);
    setShowBriefing(false);
  }, [scenario, user, quickSetupRole, setUser, startSimulation]);

  const handleEndSimulation = useCallback(() => {
    const result = endSimulation();
    if (result) {
      router.push(`/assessment/${result.id}`);
    }
  }, [endSimulation, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scenario Not Found</h1>
          <p className="text-gray-600 mb-8">
            The scenario you're looking for doesn't exist or has been removed.
          </p>
          <button onClick={() => router.push('/scenarios')} className="btn-primary">
            Browse Scenarios
          </button>
        </div>
      </div>
    );
  }

  // Briefing Screen
  if (showBriefing) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="card">
            <div className="card-header">
              <span className="badge badge-primary mb-2">{scenario.type.replace('_', ' ')}</span>
              <h1 className="text-2xl font-bold text-gray-900">{scenario.title}</h1>
            </div>
            <div className="card-body space-y-6">
              {/* Briefing */}
              <div className="bg-clinical-50 border border-clinical-200 rounded-lg p-4">
                <h2 className="font-semibold text-clinical-900 mb-2">Scenario Briefing</h2>
                <p className="text-clinical-800">{scenario.briefing}</p>
              </div>

              {/* Patient Info */}
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Patient Overview</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium">{scenario.patient.demographics.name}</p>
                    <p className="text-sm text-gray-500 mt-2 mb-1">Age / Gender</p>
                    <p className="font-medium">
                      {scenario.patient.demographics.age} years old,{' '}
                      {scenario.patient.demographics.gender}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Chief Complaint</p>
                    <p className="font-medium text-red-700">{scenario.patient.chiefComplaint}</p>
                    <p className="text-sm text-gray-500 mt-2 mb-1">Allergies</p>
                    <p className="font-medium">
                      {scenario.patient.allergies.length > 0
                        ? scenario.patient.allergies.join(', ')
                        : 'NKDA'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div>
                <h2 className="font-semibold text-gray-900 mb-3">Learning Objectives</h2>
                <ul className="space-y-2">
                  {scenario.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-clinical-600 mr-2">•</span>
                      <span className="text-gray-700">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick Role Setup */}
              {!user && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-medium text-yellow-900 mb-2">Quick Start</h3>
                  <p className="text-sm text-yellow-800 mb-3">
                    Select your role to begin the simulation:
                  </p>
                  <select
                    value={quickSetupRole}
                    onChange={(e) => setQuickSetupRole(e.target.value as ClinicalRole)}
                    className="input-field"
                  >
                    {Object.entries(CLINICAL_ROLES).map(([key, { label }]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Start Button */}
              <div className="flex justify-between items-center pt-4 border-t">
                <button
                  onClick={() => router.push('/scenarios')}
                  className="btn-secondary"
                >
                  Back to Scenarios
                </button>
                <button onClick={handleStartSimulation} className="btn-primary px-8">
                  Begin Simulation
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Active Simulation
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Simulation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
                {scenario.title}
              </h1>
              {currentPhase && (
                <span className="badge badge-primary hidden sm:inline-flex">
                  {currentPhase.name}
                </span>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-mono">{formatTime(elapsedTime)}</span>
              </div>
              <button
                onClick={() => setShowEndConfirm(true)}
                className="btn-danger text-sm px-3 py-1.5"
              >
                End Simulation
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Patient Info */}
          <div className="lg:col-span-3 space-y-4">
            <PatientDisplay
              demographics={scenario.patient.demographics}
              state={currentSession?.patientState || scenario.initialPatientState}
              chiefComplaint={scenario.patient.chiefComplaint}
              patientTrust={currentSession?.patientTrust || 50}
            />
            <VitalSignsDisplay
              vitals={currentSession?.patientState.vitals || scenario.initialPatientState.vitals}
            />
          </div>

          {/* Center - Dialogue */}
          <div className="lg:col-span-6">
            {currentNode && (
              <DialoguePanel
                currentNode={currentNode}
                onSelectOption={selectDialogueOption}
                dialogueHistory={dialogueHistory}
              />
            )}
          </div>

          {/* Right Sidebar - Actions & Progress */}
          <div className="lg:col-span-3 space-y-4">
            {currentPhase && (
              <ActionPanel
                availableActions={currentPhase.availableActions}
                performedActions={currentSession?.actionsPerformed || []}
                onPerformAction={performAction}
              />
            )}

            {/* Competency Progress */}
            <div className="card">
              <div className="card-header">
                <h2 className="font-semibold text-gray-900">Competency Progress</h2>
              </div>
              <div className="card-body space-y-3">
                {scenario.competencies.slice(0, 4).map((comp) => (
                  <CompetencyProgress
                    key={comp}
                    competency={comp}
                    score={currentSession?.competencyScores[comp] || 0}
                    maxScore={50}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* End Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 animate-fadeIn">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">End Simulation?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to end this simulation? You'll receive your assessment
                results and can review your performance.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="btn-secondary flex-1"
                >
                  Continue Simulation
                </button>
                <button onClick={handleEndSimulation} className="btn-danger flex-1">
                  End & View Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
