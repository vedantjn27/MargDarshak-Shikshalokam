"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type {
  Organization,
  ProblemStatement,
  ProblemRefinement,
  ProblemTreeResponse,
  StudentOutcomeResponse,
  TheoryOfChangeResponse,
} from "./api"

interface LFASnapshot {
  organization_profile?: {
    organization_id?: string
    theme?: string
    geography?: { state: string; district?: string }
    scale?: number
  }
  problem_definition?: {
    core_problem?: string
    affected_group?: string[]
  }
  problem_tree?: {
    root_causes?: string[]
    core_problem?: string
    effects?: string[]
  }
  outcomes?: {
    smart_outcomes?: string[]
  }
  methodology?: {
    interventions?: string[]
  }
  theory_of_change?: {
    activities?: string[]
    outputs?: string[]
    outcomes?: string[]
    impact?: string[]
  }
  measurement?: {
    indicators?: string[]
    targets?: any[]
  }
  stakeholders?: string[]
}

interface AppState {
  // Current organization
  currentOrganization: Organization | null
  setCurrentOrganization: (org: Organization | null) => void

  // Problem statements
  problemStatements: ProblemStatement[]
  setProblemStatements: (statements: ProblemStatement[]) => void
  addProblemStatement: (statement: ProblemStatement) => void

  // Current refinement
  currentRefinement: ProblemRefinement | null
  setCurrentRefinement: (refinement: ProblemRefinement | null) => void

  // Problem tree
  problemTree: ProblemTreeResponse | null
  setProblemTree: (tree: ProblemTreeResponse | null) => void

  // Student outcomes
  studentOutcomes: StudentOutcomeResponse[]
  addStudentOutcome: (outcome: StudentOutcomeResponse) => void

  // Theory of Change
  theoryOfChange: TheoryOfChangeResponse | null
  setTheoryOfChange: (toc: TheoryOfChangeResponse | null) => void

  // LFA Snapshot for completeness tracking
  lfaSnapshot: LFASnapshot
  updateLFASnapshot: (section: keyof LFASnapshot, data: any) => void

  // Reset all
  resetState: () => void
}

const initialState = {
  currentOrganization: null,
  problemStatements: [],
  currentRefinement: null,
  problemTree: null,
  studentOutcomes: [],
  theoryOfChange: null,
  lfaSnapshot: {},
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialState,

      setCurrentOrganization: (org) => set({ currentOrganization: org }),

      setProblemStatements: (statements) => set({ problemStatements: statements }),
      addProblemStatement: (statement) =>
        set((state) => ({ problemStatements: [...state.problemStatements, statement] })),

      setCurrentRefinement: (refinement) => set({ currentRefinement: refinement }),

      setProblemTree: (tree) => set({ problemTree: tree }),

      addStudentOutcome: (outcome) => set((state) => ({ studentOutcomes: [...state.studentOutcomes, outcome] })),

      setTheoryOfChange: (toc) => set({ theoryOfChange: toc }),

      updateLFASnapshot: (section, data) =>
        set((state) => ({
          lfaSnapshot: { ...state.lfaSnapshot, [section]: data },
        })),

      resetState: () => set(initialState),
    }),
    {
      name: "margdarshak-storage",
    },
  ),
)
