// Clinical Roles
export type ClinicalRole =
  | 'medical_assistant'
  | 'registered_nurse'
  | 'nurse_practitioner'
  | 'physician_assistant'
  | 'er_physician'
  | 'primary_care_physician'
  | 'specialist'
  | 'pharmacist'
  | 'paramedic';

export const CLINICAL_ROLES: Record<ClinicalRole, { label: string; description: string }> = {
  medical_assistant: {
    label: 'Medical Assistant',
    description: 'Front-line support for clinical operations, patient intake, and basic clinical procedures',
  },
  registered_nurse: {
    label: 'Registered Nurse',
    description: 'Patient care, medication administration, and care coordination',
  },
  nurse_practitioner: {
    label: 'Nurse Practitioner',
    description: 'Advanced practice nursing with diagnostic and prescriptive authority',
  },
  physician_assistant: {
    label: 'Physician Assistant',
    description: 'Medical practice under physician supervision with broad clinical responsibilities',
  },
  er_physician: {
    label: 'ER Physician',
    description: 'Emergency medicine specialist handling acute and critical conditions',
  },
  primary_care_physician: {
    label: 'Primary Care Physician',
    description: 'Comprehensive care for patients across all ages and conditions',
  },
  specialist: {
    label: 'Specialist Physician',
    description: 'Focused expertise in specific medical domains',
  },
  pharmacist: {
    label: 'Pharmacist',
    description: 'Medication therapy management and patient counseling',
  },
  paramedic: {
    label: 'Paramedic',
    description: 'Pre-hospital emergency medical care and transport',
  },
};

// Competency Categories
export type CompetencyCategory =
  | 'clinical_knowledge'
  | 'patient_communication'
  | 'clinical_reasoning'
  | 'procedural_skills'
  | 'empathy_compassion'
  | 'professionalism'
  | 'teamwork'
  | 'safety_quality'
  | 'documentation'
  | 'cultural_competence';

export const COMPETENCY_CATEGORIES: Record<CompetencyCategory, { label: string; description: string }> = {
  clinical_knowledge: {
    label: 'Clinical Knowledge',
    description: 'Medical facts, pathophysiology, pharmacology, and evidence-based practices',
  },
  patient_communication: {
    label: 'Patient Communication',
    description: 'Clear, effective communication with patients and families',
  },
  clinical_reasoning: {
    label: 'Clinical Reasoning',
    description: 'Diagnostic thinking, differential diagnosis, and treatment planning',
  },
  procedural_skills: {
    label: 'Procedural Skills',
    description: 'Technical competence in clinical procedures',
  },
  empathy_compassion: {
    label: 'Empathy & Compassion',
    description: 'Understanding and responding to patient emotions and needs',
  },
  professionalism: {
    label: 'Professionalism',
    description: 'Ethical conduct, accountability, and professional behavior',
  },
  teamwork: {
    label: 'Teamwork & Collaboration',
    description: 'Working effectively with healthcare team members',
  },
  safety_quality: {
    label: 'Safety & Quality',
    description: 'Patient safety practices and quality improvement',
  },
  documentation: {
    label: 'Documentation',
    description: 'Accurate and complete medical documentation',
  },
  cultural_competence: {
    label: 'Cultural Competence',
    description: 'Culturally sensitive and appropriate care',
  },
};

// Difficulty Levels
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

// Scenario Types
export type ScenarioType =
  | 'patient_encounter'
  | 'emergency'
  | 'procedure'
  | 'counseling'
  | 'handoff'
  | 'difficult_conversation'
  | 'team_collaboration';

// Patient Demographics
export interface PatientDemographics {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'non_binary' | 'other';
  pronouns: string;
  ethnicity?: string;
  language?: string;
  occupation?: string;
}

// Vital Signs
export interface VitalSigns {
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  painLevel?: number;
  weight?: number;
  height?: number;
}

// Patient State
export interface PatientState {
  vitals: VitalSigns;
  symptoms: string[];
  emotionalState: 'calm' | 'anxious' | 'distressed' | 'angry' | 'confused' | 'withdrawn';
  cooperationLevel: 'cooperative' | 'reluctant' | 'uncooperative';
  consciousness: 'alert' | 'drowsy' | 'confused' | 'unresponsive';
}

// Dialogue Option
export interface DialogueOption {
  id: string;
  text: string;
  type: 'question' | 'statement' | 'action' | 'empathy' | 'education';
  competencies: CompetencyCategory[];
  appropriateness: 'optimal' | 'acceptable' | 'suboptimal' | 'inappropriate';
  feedback?: string;
  nextNodeId?: string;
  effects?: {
    patientTrust?: number;
    patientAnxiety?: number;
    informationGained?: string[];
    competencyScores?: Partial<Record<CompetencyCategory, number>>;
  };
}

// Dialogue Node
export interface DialogueNode {
  id: string;
  type: 'patient_speech' | 'patient_action' | 'system_event' | 'decision_point' | 'assessment';
  content: string;
  patientEmotion?: string;
  options?: DialogueOption[];
  autoAdvance?: boolean;
  autoAdvanceDelay?: number;
  nextNodeId?: string;
  conditions?: {
    requiredActions?: string[];
    requiredInformation?: string[];
    timeLimit?: number;
  };
}

// Clinical Action
export interface ClinicalAction {
  id: string;
  name: string;
  category: 'examination' | 'procedure' | 'order' | 'medication' | 'documentation' | 'consultation';
  description: string;
  requiredEquipment?: string[];
  competencies: CompetencyCategory[];
  appropriateness: 'indicated' | 'optional' | 'not_indicated' | 'contraindicated';
  feedback?: string;
  results?: string;
  effects?: {
    patientStateChanges?: Partial<PatientState>;
    informationRevealed?: string[];
    timeElapsed?: number;
  };
}

// Scenario Phase
export interface ScenarioPhase {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  startingNodeId: string;
  dialogueNodes: DialogueNode[];
  availableActions: ClinicalAction[];
  timeLimit?: number;
  completionCriteria: {
    requiredNodes?: string[];
    requiredActions?: string[];
    requiredInformation?: string[];
    minimumCompetencyScores?: Partial<Record<CompetencyCategory, number>>;
  };
}

// Clinical Scenario
export interface ClinicalScenario {
  id: string;
  title: string;
  description: string;
  briefing: string;
  targetRoles: ClinicalRole[];
  difficulty: DifficultyLevel;
  type: ScenarioType;
  estimatedDuration: number; // in minutes
  competencies: CompetencyCategory[];
  learningObjectives: string[];
  patient: {
    demographics: PatientDemographics;
    chiefComplaint: string;
    presentingProblem: string;
    medicalHistory: string[];
    medications: string[];
    allergies: string[];
    socialHistory?: string;
    familyHistory?: string;
  };
  initialPatientState: PatientState;
  phases: ScenarioPhase[];
  debriefing: {
    keyLearningPoints: string[];
    commonMistakes: string[];
    bestPractices: string[];
    references?: string[];
  };
  metadata: {
    author: string;
    createdAt: string;
    updatedAt: string;
    version: string;
    tags: string[];
    specialties?: string[];
  };
}

// User Profile
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: ClinicalRole;
  organization?: string;
  yearsOfExperience?: number;
  specializations?: string[];
  createdAt: string;
}

// Simulation Session
export interface SimulationSession {
  id: string;
  oderId: string;
  scenarioId: string;
  startedAt: string;
  completedAt?: string;
  currentPhaseId: string;
  currentNodeId: string;
  elapsedTime: number;
  dialogueHistory: Array<{
    timestamp: string;
    nodeId: string;
    selectedOptionId?: string;
    actionTaken?: string;
  }>;
  actionsPerformed: string[];
  informationGathered: string[];
  patientState: PatientState;
  patientTrust: number;
  competencyScores: Partial<Record<CompetencyCategory, number>>;
  notes: string[];
}

// Assessment Result
export interface AssessmentResult {
  id: string;
  oderId: string;
  sessionId: string;
  scenarioId: string;
  completedAt: string;
  overallScore: number;
  passed: boolean;
  timeSpent: number;
  competencyScores: Record<CompetencyCategory, {
    score: number;
    maxScore: number;
    percentage: number;
    feedback: string;
  }>;
  strengths: string[];
  areasForImprovement: string[];
  detailedFeedback: string;
  recommendations: string[];
}

// Learning Progress
export interface LearningProgress {
  oderId: string;
  completedScenarios: string[];
  inProgressScenarios: string[];
  totalSimulationTime: number;
  averageScore: number;
  competencyProgress: Record<CompetencyCategory, {
    level: number;
    totalAttempts: number;
    averageScore: number;
    trend: 'improving' | 'stable' | 'declining';
  }>;
  achievements: Array<{
    id: string;
    name: string;
    earnedAt: string;
  }>;
  recentActivity: Array<{
    scenarioId: string;
    completedAt: string;
    score: number;
  }>;
}
