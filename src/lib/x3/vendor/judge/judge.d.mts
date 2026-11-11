// Types for the vendored judge.mjs (see ../PROVENANCE.md). Only what this site calls.

export type Decision = "preflight_passed" | "approval_required" | "denied_by_policy";
export type ShownDecision = Decision | "contract_only";

export interface GuardCheck {
  guard: string;
  ok: boolean;
  detail?: string;
}

export interface Scenario {
  id: string;
  group: "A" | "B";
  title: string;
  story: string;
  takeaway: string;
  evidence_state: string;
  intent: { file: string; source: string; sha256: string; edits: { from: string; to: string }[] };
  assumed_guard_state: { revoked?: boolean; spends?: { amount: string; at_ms: number }[] } | null;
  contract_only: boolean;
  contract_note: string | null;
  contract_tests: string[];
  python: { decision: Decision; denied_guards: string[]; approvals_needed: number; checks: { guard: string; ok: boolean }[] };
}

export interface ScenarioData {
  schema: string;
  generated_by: string;
  evaluated_at: string;
  evidence_level: string;
  groups: Record<string, string>;
  mandate: { file: string; source: string; sha256: string };
  tokens: { file: string; records: unknown[]; note: string };
  scenarios: Scenario[];
  summary: Record<string, number>;
}

export interface Evaluation {
  decision: Decision;
  checks: GuardCheck[];
  denied_guards: string[];
  approvals_needed: number;
  leg: Record<string, unknown> & { amount: string; recipient: string; mandate_owner?: string };
  mandate: { name: string; owner: string; agent: string; terms: Record<string, unknown>; expires: string };
  policy?: Record<string, unknown> & { program_sha256: string };
  state?: Record<string, unknown>;
}

export const EVIDENCE_LADDER: { level: string; label: string; proven: boolean; how: string }[];
export const DECISIONS: Record<ShownDecision, { tone: "pass" | "note" | "fail" | "seal"; label: string; detail: string }>;

export function evaluate(data: ScenarioData, scenario: Pick<Scenario, "intent" | "assumed_guard_state">): Promise<Evaluation>;
export function shownDecision(scenario: Pick<Scenario, "contract_only">, result: Evaluation): ShownDecision;
export function agrees(scenario: Scenario, result: Evaluation): boolean;
