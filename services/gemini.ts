import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, ProjectFile } from "../types";

const REDVOID_SYSTEM_INSTRUCTION = `
You are RedVoid, an advanced Cybersecurity Analysis, Exploit Simulation, and Defense Engineering Intelligence System.
You operate in Hack & Defend Mode.

ROLE:
You are an Expert Application Security Engineer, Red Team + Blue Team specialist.
You think and operate simultaneously as:
- A Red Team Hacker
- A Blue Team Defender
- A Security Architect

CRITICAL VULNERABILITY DETECTION RULES:
You must aggressively detect and flag:
- SQL Injection, NoSQL Injection, XSS
- Command Injection, RCE
- IDOR, Broken Authentication, JWT Attacks
- Hardcoded Secrets, Plaintext Passwords
- Buffer Overflows (C/C++), Memory Safety issues
- Business Logic Abuse, Race Conditions

If ANY of these are found:
🔥 SYSTEM STATUS: FULLY COMPROMISED — CRITICAL
No soft rating. No mercy.

REPORTING REQUIREMENTS:
1. EXPLODE THE ATTACK: Generate a step-by-step kill chain showing exactly how the system is destroyed across the provided files.
2. SHOW THE IMPACT: Access -> Control -> Data -> Money.
3. FIX IT: Provide enterprise-grade secure code rewrites.

OUTPUT FORMAT:
Return strictly JSON matching the schema provided.
`;

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    metrics: {
      type: Type.OBJECT,
      properties: {
        system_status: { type: Type.STRING },
        risk_rating: { type: Type.STRING },
        defense_readiness: { type: Type.INTEGER },
        exploit_readiness: { type: Type.INTEGER },
        attack_surface_summary: { type: Type.STRING },
        weakest_link: { type: Type.STRING },
        blast_radius: { type: Type.STRING },
        financial_damage_estimate: { type: Type.STRING },
        data_breach_probability: { type: Type.STRING },
        regulatory_risk: { type: Type.STRING },
        critical_issues_count: { type: Type.INTEGER },
      },
      required: [
        "system_status", "risk_rating", "defense_readiness", "exploit_readiness",
        "attack_surface_summary", "weakest_link", "blast_radius",
        "financial_damage_estimate", "data_breach_probability", "regulatory_risk",
        "critical_issues_count"
      ]
    },
    vulnerabilities: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
          file_name: { type: Type.STRING },
          attack_type: { type: Type.STRING },
          exploit_readiness: { type: Type.INTEGER },
          defense_failure: { type: Type.INTEGER },
          attack_flow: { type: Type.STRING },
          impact_analysis: { type: Type.STRING },
          fixed_code: { type: Type.STRING },
          fix_explanation: { type: Type.STRING },
        },
        required: ["name", "severity", "attack_type", "exploit_readiness", "defense_failure", "attack_flow", "impact_analysis", "fixed_code", "fix_explanation"]
      }
    },
    attack_chain: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          step: { type: Type.INTEGER },
          description: { type: Type.STRING },
          gain: { type: Type.STRING },
          vulnerable_line: { type: Type.STRING },
          file_name: { type: Type.STRING }
        },
        required: ["step", "description", "gain"]
      }
    },
    remediations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          issue: { type: Type.STRING },
          fix: { type: Type.STRING },
          code_snippet: { type: Type.STRING },
          file_name: { type: Type.STRING }
        },
        required: ["issue", "fix", "code_snippet"]
      }
    },
    executive_summary: { type: Type.STRING }
  },
  required: ["metrics", "vulnerabilities", "attack_chain", "remediations", "executive_summary"]
};

export const analyzeSecurity = async (
  files: ProjectFile[]
): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Check .env configuration.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Construct a prompt that clearly separates multiple files
  let codeContext = "";
  files.forEach(f => {
    if (f.content.trim()) {
      codeContext += `
=== BEGIN FILE: ${f.name} (${f.language}) ===
${f.content}
=== END FILE: ${f.name} ===

`;
    }
  });

  if (!codeContext.trim()) {
    throw new Error("No source code provided for analysis.");
  }

  const prompt = `
    TARGET PROJECT FILES FOR ANALYSIS:
    ${codeContext}
    
    EXECUTE HACK_AND_DEFEND PROTOCOL.
    Analyze the relationships between these files (e.g., if Flask uses the C crypto tool).
    GENERATE A DETAILED ATTACK CHAIN OF AT LEAST 5 STEPS.
    GENERATE SPECIFIC REMEDIATIONS MAPPED TO CODE.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: REDVOID_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.2, 
      }
    });

    let text = response.text;
    if (!text) throw new Error("Connection to RedVoid Core failed.");
    
    // Sanitize output: Remove markdown code fences if Gemini adds them (it sometimes does despite config)
    text = text.replace(/^```json/gm, '').replace(/^```/gm, '').trim();

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("RedVoid Analysis Failed:", error);
    throw error;
  }
};