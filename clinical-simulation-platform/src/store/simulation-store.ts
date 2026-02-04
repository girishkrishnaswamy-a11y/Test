import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ClinicalScenario,
  SimulationSession,
  PatientState,
  CompetencyCategory,
  AssessmentResult,
  LearningProgress,
  UserProfile,
  ClinicalRole,
  DialogueNode,
  DialogueOption,
} from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface SimulationState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Current Session
  currentSession: SimulationSession | null;
  currentScenario: ClinicalScenario | null;

  // Session Management
  startSimulation: (scenario: ClinicalScenario) => void;
  endSimulation: () => AssessmentResult | null;

  // Dialogue & Actions
  selectDialogueOption: (option: DialogueOption) => void;
  performAction: (actionId: string) => void;
  advanceToNode: (nodeId: string) => void;

  // Session State
  updatePatientState: (updates: Partial<PatientState>) => void;
  addNote: (note: string) => void;

  // Progress
  learningProgress: LearningProgress | null;
  completedSessions: AssessmentResult[];
  updateProgress: (result: AssessmentResult) => void;

  // Current node helper
  getCurrentNode: () => DialogueNode | null;
  getCurrentPhase: () => ClinicalScenario['phases'][0] | null;
}

const initialCompetencyScores: Record<CompetencyCategory, number> = {
  clinical_knowledge: 0,
  patient_communication: 0,
  clinical_reasoning: 0,
  procedural_skills: 0,
  empathy_compassion: 0,
  professionalism: 0,
  teamwork: 0,
  safety_quality: 0,
  documentation: 0,
  cultural_competence: 0,
};

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set, get) => ({
      user: null,
      currentSession: null,
      currentScenario: null,
      learningProgress: null,
      completedSessions: [],

      setUser: (user) => {
        set({ user });
        if (user && !get().learningProgress) {
          set({
            learningProgress: {
              oderId: user.id,
              completedScenarios: [],
              inProgressScenarios: [],
              totalSimulationTime: 0,
              averageScore: 0,
              competencyProgress: Object.keys(initialCompetencyScores).reduce(
                (acc, key) => ({
                  ...acc,
                  [key]: { level: 1, totalAttempts: 0, averageScore: 0, trend: 'stable' as const },
                }),
                {} as LearningProgress['competencyProgress']
              ),
              achievements: [],
              recentActivity: [],
            },
          });
        }
      },

      startSimulation: (scenario) => {
        const user = get().user;
        if (!user) return;

        const session: SimulationSession = {
          id: uuidv4(),
          oderId: user.id,
          scenarioId: scenario.id,
          startedAt: new Date().toISOString(),
          currentPhaseId: scenario.phases[0].id,
          currentNodeId: scenario.phases[0].startingNodeId,
          elapsedTime: 0,
          dialogueHistory: [],
          actionsPerformed: [],
          informationGathered: [],
          patientState: { ...scenario.initialPatientState },
          patientTrust: 50,
          competencyScores: { ...initialCompetencyScores },
          notes: [],
        };

        set({
          currentSession: session,
          currentScenario: scenario,
        });
      },

      endSimulation: () => {
        const { currentSession, currentScenario, user } = get();
        if (!currentSession || !currentScenario || !user) return null;

        const completedAt = new Date().toISOString();
        const timeSpent = Math.round(
          (new Date(completedAt).getTime() - new Date(currentSession.startedAt).getTime()) / 1000
        );

        // Calculate scores
        const competencyScores: AssessmentResult['competencyScores'] = {} as any;
        let totalScore = 0;
        let maxTotal = 0;

        for (const [key, value] of Object.entries(currentSession.competencyScores)) {
          const maxScore = 100;
          const percentage = Math.min(100, Math.max(0, (value / maxScore) * 100));
          totalScore += value;
          maxTotal += maxScore;

          competencyScores[key as CompetencyCategory] = {
            score: value,
            maxScore,
            percentage,
            feedback: getFeedbackForScore(percentage),
          };
        }

        const overallScore = maxTotal > 0 ? Math.round((totalScore / maxTotal) * 100) : 0;
        const passed = overallScore >= 70;

        const result: AssessmentResult = {
          id: uuidv4(),
          oderId: user.id,
          sessionId: currentSession.id,
          scenarioId: currentScenario.id,
          completedAt,
          overallScore,
          passed,
          timeSpent,
          competencyScores,
          strengths: getStrengths(competencyScores),
          areasForImprovement: getAreasForImprovement(competencyScores),
          detailedFeedback: generateDetailedFeedback(currentScenario, competencyScores, passed),
          recommendations: generateRecommendations(competencyScores),
        };

        // Update progress
        get().updateProgress(result);

        set({
          currentSession: null,
          currentScenario: null,
          completedSessions: [...get().completedSessions, result],
        });

        return result;
      },

      selectDialogueOption: (option) => {
        const { currentSession, currentScenario } = get();
        if (!currentSession || !currentScenario) return;

        const newCompetencyScores = { ...currentSession.competencyScores };
        if (option.effects?.competencyScores) {
          for (const [key, value] of Object.entries(option.effects.competencyScores)) {
            newCompetencyScores[key as CompetencyCategory] =
              (newCompetencyScores[key as CompetencyCategory] || 0) + value;
          }
        }

        // Base competency points for choosing
        option.competencies.forEach((comp) => {
          const points =
            option.appropriateness === 'optimal'
              ? 10
              : option.appropriateness === 'acceptable'
                ? 5
                : option.appropriateness === 'suboptimal'
                  ? 0
                  : -5;
          newCompetencyScores[comp] = (newCompetencyScores[comp] || 0) + points;
        });

        const newPatientTrust =
          currentSession.patientTrust + (option.effects?.patientTrust || 0);

        const newInformationGathered = [
          ...currentSession.informationGathered,
          ...(option.effects?.informationGained || []),
        ];

        set({
          currentSession: {
            ...currentSession,
            currentNodeId: option.nextNodeId || currentSession.currentNodeId,
            dialogueHistory: [
              ...currentSession.dialogueHistory,
              {
                timestamp: new Date().toISOString(),
                nodeId: currentSession.currentNodeId,
                selectedOptionId: option.id,
              },
            ],
            patientTrust: Math.max(0, Math.min(100, newPatientTrust)),
            competencyScores: newCompetencyScores,
            informationGathered: newInformationGathered,
          },
        });
      },

      performAction: (actionId) => {
        const { currentSession, currentScenario } = get();
        if (!currentSession || !currentScenario) return;

        const currentPhase = currentScenario.phases.find(
          (p) => p.id === currentSession.currentPhaseId
        );
        if (!currentPhase) return;

        const action = currentPhase.availableActions.find((a) => a.id === actionId);
        if (!action) return;

        const newCompetencyScores = { ...currentSession.competencyScores };
        action.competencies.forEach((comp) => {
          const points =
            action.appropriateness === 'indicated'
              ? 10
              : action.appropriateness === 'optional'
                ? 5
                : action.appropriateness === 'not_indicated'
                  ? -5
                  : -15;
          newCompetencyScores[comp] = (newCompetencyScores[comp] || 0) + points;
        });

        const newInformationGathered = [
          ...currentSession.informationGathered,
          ...(action.effects?.informationRevealed || []),
        ];

        set({
          currentSession: {
            ...currentSession,
            actionsPerformed: [...currentSession.actionsPerformed, actionId],
            competencyScores: newCompetencyScores,
            informationGathered: newInformationGathered,
            patientState: action.effects?.patientStateChanges
              ? { ...currentSession.patientState, ...action.effects.patientStateChanges }
              : currentSession.patientState,
          },
        });
      },

      advanceToNode: (nodeId) => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            currentNodeId: nodeId,
            dialogueHistory: [
              ...currentSession.dialogueHistory,
              {
                timestamp: new Date().toISOString(),
                nodeId,
              },
            ],
          },
        });
      },

      updatePatientState: (updates) => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            patientState: {
              ...currentSession.patientState,
              ...updates,
            },
          },
        });
      },

      addNote: (note) => {
        const { currentSession } = get();
        if (!currentSession) return;

        set({
          currentSession: {
            ...currentSession,
            notes: [...currentSession.notes, note],
          },
        });
      },

      updateProgress: (result) => {
        const { learningProgress } = get();
        if (!learningProgress) return;

        const newProgress = { ...learningProgress };

        // Add to completed scenarios if passed
        if (result.passed && !newProgress.completedScenarios.includes(result.scenarioId)) {
          newProgress.completedScenarios.push(result.scenarioId);
        }

        // Remove from in-progress
        newProgress.inProgressScenarios = newProgress.inProgressScenarios.filter(
          (id) => id !== result.scenarioId
        );

        // Update total time
        newProgress.totalSimulationTime += result.timeSpent;

        // Update average score
        const allScores = [...get().completedSessions, result].map((r) => r.overallScore);
        newProgress.averageScore =
          allScores.reduce((a, b) => a + b, 0) / allScores.length;

        // Update competency progress
        for (const [key, value] of Object.entries(result.competencyScores)) {
          const existing = newProgress.competencyProgress[key as CompetencyCategory];
          const newAvg =
            (existing.averageScore * existing.totalAttempts + value.percentage) /
            (existing.totalAttempts + 1);

          newProgress.competencyProgress[key as CompetencyCategory] = {
            level: Math.floor(newAvg / 20) + 1,
            totalAttempts: existing.totalAttempts + 1,
            averageScore: newAvg,
            trend:
              newAvg > existing.averageScore
                ? 'improving'
                : newAvg < existing.averageScore
                  ? 'declining'
                  : 'stable',
          };
        }

        // Add to recent activity
        newProgress.recentActivity = [
          {
            scenarioId: result.scenarioId,
            completedAt: result.completedAt,
            score: result.overallScore,
          },
          ...newProgress.recentActivity.slice(0, 9),
        ];

        set({ learningProgress: newProgress });
      },

      getCurrentNode: () => {
        const { currentSession, currentScenario } = get();
        if (!currentSession || !currentScenario) return null;

        const currentPhase = currentScenario.phases.find(
          (p) => p.id === currentSession.currentPhaseId
        );
        if (!currentPhase) return null;

        return (
          currentPhase.dialogueNodes.find((n) => n.id === currentSession.currentNodeId) ||
          null
        );
      },

      getCurrentPhase: () => {
        const { currentSession, currentScenario } = get();
        if (!currentSession || !currentScenario) return null;

        return (
          currentScenario.phases.find((p) => p.id === currentSession.currentPhaseId) || null
        );
      },
    }),
    {
      name: 'clinical-simulation-storage',
      partialize: (state) => ({
        user: state.user,
        learningProgress: state.learningProgress,
        completedSessions: state.completedSessions,
      }),
    }
  )
);

function getFeedbackForScore(percentage: number): string {
  if (percentage >= 90) return 'Excellent performance demonstrating mastery';
  if (percentage >= 80) return 'Strong performance with minor areas for growth';
  if (percentage >= 70) return 'Competent performance meeting expectations';
  if (percentage >= 60) return 'Developing competence with room for improvement';
  return 'Additional practice recommended';
}

function getStrengths(
  scores: AssessmentResult['competencyScores']
): string[] {
  return Object.entries(scores)
    .filter(([, v]) => v.percentage >= 80)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 3)
    .map(([k]) => k.replace(/_/g, ' '));
}

function getAreasForImprovement(
  scores: AssessmentResult['competencyScores']
): string[] {
  return Object.entries(scores)
    .filter(([, v]) => v.percentage < 70)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 3)
    .map(([k]) => k.replace(/_/g, ' '));
}

function generateDetailedFeedback(
  scenario: ClinicalScenario,
  scores: AssessmentResult['competencyScores'],
  passed: boolean
): string {
  const status = passed ? 'successfully completed' : 'completed with areas needing improvement in';
  const topCompetency = Object.entries(scores).sort(
    (a, b) => b[1].percentage - a[1].percentage
  )[0];

  return `You ${status} the "${scenario.title}" scenario. Your strongest area was ${topCompetency[0].replace(/_/g, ' ')} with ${Math.round(topCompetency[1].percentage)}% proficiency. Review the debriefing materials for key learning points and best practices.`;
}

function generateRecommendations(
  scores: AssessmentResult['competencyScores']
): string[] {
  const recommendations: string[] = [];

  const lowScores = Object.entries(scores)
    .filter(([, v]) => v.percentage < 70)
    .map(([k]) => k);

  if (lowScores.includes('empathy_compassion')) {
    recommendations.push('Practice acknowledging patient emotions before problem-solving');
  }
  if (lowScores.includes('clinical_reasoning')) {
    recommendations.push('Focus on systematic diagnostic approaches and differential diagnosis');
  }
  if (lowScores.includes('patient_communication')) {
    recommendations.push('Work on open-ended questioning and active listening techniques');
  }
  if (lowScores.includes('safety_quality')) {
    recommendations.push('Review safety protocols and error prevention strategies');
  }

  if (recommendations.length === 0) {
    recommendations.push('Continue practicing to maintain and enhance your competencies');
  }

  return recommendations;
}
