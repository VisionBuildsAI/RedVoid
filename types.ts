export interface ProjectFile {
  name: string;
  language: string;
  content: string;
}

export interface Vulnerability {
  name: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  file_name?: string; // Added to track which file is vulnerable
  attack_type: string;
  exploit_readiness: number;
  defense_failure: number;
  attack_flow: string;
  impact_analysis: string;
  fixed_code: string;
  fix_explanation: string;
}

export interface AttackStep {
  step: number;
  description: string;
  gain: string; 
  vulnerable_line?: string;
  file_name?: string; // Added context
}

export interface Remediation {
  issue: string;
  fix: string;
  code_snippet: string;
  file_name?: string; // Added context
}

export interface SecurityMetrics {
  system_status: string;
  risk_rating: string;
  defense_readiness: number;
  exploit_readiness: number;
  attack_surface_summary: string;
  weakest_link: string;
  blast_radius: string;
  financial_damage_estimate: string;
  data_breach_probability: string;
  regulatory_risk: string;
  critical_issues_count: number;
}

export interface AnalysisResult {
  metrics: SecurityMetrics;
  vulnerabilities: Vulnerability[];
  attack_chain: AttackStep[];
  remediations: Remediation[];
  executive_summary: string;
}

export type UserMode = 'HACK_DEFEND';
export const UserMode = {
  HACK_DEFEND: 'HACK_DEFEND' as UserMode
};