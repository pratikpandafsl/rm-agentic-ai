/**
 * Single source of truth for all screen content.
 * Swap these objects for API responses later — the shape stays the same.
 */

export type TenantId = "mayo" | "fsl";

export interface TenantData {
  id: TenantId;
  /** Label shown in the top-bar dropdown. */
  name: string;
  /** Short name used inside copy. */
  shortName: string;
  /** Sidebar subtitle. */
  phaseLabel: string;
  environment: string;
  duration: string;
  overview: {
    title: string;
    subtitle: string;
    stats: { label: string; value: string; hint: string }[];
    lifecycleSteps: string[];
    policyNote: string;
  };
  projectSetup: {
    project: string;
    periodOptions: string[];
    groundTruthOptions: string[];
    goal: string;
  };
  rules: {
    items: { id: string; name: string; category: string; version: string; status: "Published" | "Draft" }[];
    thenOptions: string[];
    defaultRuleName: string;
    defaultWhen: string;
    defaultSource: string;
    simulateResult: string;
  };
  dataSources: {
    items: { name: string; system: string; status: "Ready" | "Access check" | "Pending"; rows?: string }[];
  };
  mappingQuality: {
    metrics: { label: string; value: string; detail: string }[];
    mappings: { source: string; sourceField: string; canonicalField: string; status: "Mapped" | "Review" }[];
    validateResult: string;
    warning: string;
  };
  agents: { name: string; schema: string; description: string }[];
  workflow: { name: string; agents: { id: number; name: string; enabled: boolean }[] };
  pocRuns: {
    stages: string[];
    dataset: string;
    workflow: string;
    runs: { id: string; accounts: number; dataset: string; workflow: string; status: string }[];
  };
  accountResults: {
    account: string;
    state: string;
    cause: string;
    action: string;
    confidence: string;
    evidence: string;
    review: string;
  }[];
  patterns: {
    id: string;
    title: string;
    accounts: number;
    consistency: number;
    fields: string[];
    status: string;
    examples: string;
  }[];
  outputFile: {
    fileName: string;
    rows: {
      account: string;
      history: string;
      state: string;
      cause: string;
      action: string;
      confidence: string;
      fields: string;
    }[];
  };
  hitl: {
    account: string;
    history: { date: string; event: string; detail: string }[];
    fields: string[];
    recommendation: string;
    confidence: string;
    missing: string;
    outcomeOptions: string[];
    actionOptions: string[];
  };
  validation: {
    metrics: { label: string; value: string; detail: string }[];
    considerations: string[];
  };
  audit: { time: string; event: string; actor: string; object: string }[];
}

const mayo: TenantData = {
  id: "mayo",
  name: "Mayo POC",
  shortName: "Mayo",
  phaseLabel: "Mayo Phase 1",
  environment: "Test",
  duration: "1-2 months",
  overview: {
    title: "Mayo Phase 1 lifecycle",
    subtitle:
      "A configurable, evidence-led AR intelligence workflow with governed human validation.",
    stats: [
      { label: "Sample accounts", value: "10", hint: "Paid accounts first" },
      { label: "Approved sources", value: "4", hint: "Cross-source correlation" },
      { label: "Configured agents", value: "6", hint: "Versioned contracts" },
      { label: "Review queue", value: "2", hint: "Evidence and risk triggers" },
    ],
    lifecycleSteps: [
      "Rules",
      "Upload",
      "Validate",
      "Agents",
      "Workflow",
      "Process",
      "Patterns",
      "Output",
      "HITL",
      "Measure",
    ],
    policyNote:
      "Paid accounts provide positive path evidence. Historical write-offs, returns and adjustments remain context until Operations adjudicates them.",
  },
  projectSetup: {
    project: "Mayo Phase 1 POC",
    periodOptions: ["To be confirmed", "Last 30 days", "Last 90 days", "Last 12 months"],
    groundTruthOptions: ["Paid accounts first", "Write-offs adjudicated", "All historical outcomes"],
    goal: "Reconstruct claim lifecycle, correlate evidence, determine current state/root cause and recommend one approved action.",
  },
  rules: {
    items: [
      { id: "R-001", name: "Timely filing", category: "Filing", version: "v3", status: "Published" },
      { id: "R-003", name: "Appeal window", category: "Appeal", version: "v4", status: "Draft" },
      { id: "R-007", name: "Underpayment evidence", category: "Financial", version: "v2", status: "Published" },
    ],
    thenOptions: [
      "Action = APPEAL; HITL = Required",
      "Action = WRITE_OFF; HITL = Required",
      "Action = ESCALATE; HITL = Optional",
      "Action = NO_ACTION; HITL = None",
    ],
    defaultRuleName: "Appeal evidence and deadline",
    defaultWhen:
      "denial_is_appealable = true AND appeal_deadline >= today AND supporting_evidence = true",
    defaultSource: "Mayo SOP | Operations",
    simulateResult: "Simulation complete: 12 accounts matched, 0 conflicts.",
  },
  dataSources: {
    items: [
      { name: "Mayo inventory", system: "Celonis", status: "Ready", rows: "120 rows" },
      { name: "835 / remittance", system: "Celonis, line-level", status: "Ready", rows: "386 rows" },
      { name: "Worked / closed accounts", system: "Celonis", status: "Access check" },
      { name: "Historical notes", system: "Consolidated FACS file", status: "Pending" },
    ],
  },
  mappingQuality: {
    metrics: [
      { label: "Completeness", value: "93%", detail: "Required fields" },
      { label: "Cross-source match", value: "86%", detail: "Account, claim and line" },
      { label: "Exceptions", value: "17", detail: "Downloadable rows" },
    ],
    mappings: [
      { source: "Inventory", sourceField: "Acct No", canonicalField: "account_id", status: "Mapped" },
      { source: "835", sourceField: "CLP07", canonicalField: "payer_claim_control_number", status: "Mapped" },
      { source: "835", sourceField: "Check Date", canonicalField: "payment_date", status: "Mapped" },
      { source: "Notes", sourceField: "Activity Date", canonicalField: "note_date", status: "Review" },
    ],
    validateResult: "Validation complete. 17 exceptions found.",
    warning:
      "Critical unmapped identifiers, privacy violations or invalid date/amount structures block processing.",
  },
  agents: [
    { name: "Data Validation Agent", schema: "DataValidationOutput v1", description: "Validate source completeness, mappings, joins and contradictions." },
    { name: "Timeline Reconstruction Agent", schema: "TimelineOutput v1", description: "Reconstruct the ordered account timeline from supplied evidence." },
    { name: "Evidence Correlation Agent", schema: "EvidenceCorrelationOutput v1", description: "Correlate remittance, inventory and note evidence across sources." },
    { name: "State & Root Cause Agent", schema: "StateCauseOutput v1", description: "Determine the current account state and supported root cause." },
    { name: "Next Action Agent", schema: "NextActionOutput v1", description: "Recommend the next compliant action from validated evidence." },
    { name: "Review Routing Agent", schema: "ReviewRoutingOutput v1", description: "Route uncertain or high-impact results for human review." },
  ],
  workflow: {
    name: "Mayo Evidence Workflow v1",
    agents: [
      { id: 1, name: "Data Validation Agent", enabled: true },
      { id: 2, name: "Timeline Reconstruction Agent", enabled: true },
      { id: 3, name: "Evidence Correlation Agent", enabled: true },
      { id: 4, name: "State & Root Cause Agent", enabled: true },
      { id: 5, name: "Next Action Agent", enabled: true },
      { id: 6, name: "Review Routing Agent", enabled: true },
    ],
  },
  pocRuns: {
    stages: ["Rules applied", "Timeline built", "Evidence correlated", "State & cause", "Action", "Review route"],
    dataset: "Mayo paid sample v1",
    workflow: "Workflow v1",
    runs: [
      { id: "RUN-001", accounts: 10, dataset: "Mayo paid sample v1", workflow: "Workflow v1", status: "Completed with gaps" },
    ],
  },
  accountResults: [
    { account: "MAYO-000184", state: "Denied, unpaid", cause: "Missing modifier after coding denial", action: "Correct and rebill", confidence: "91%", evidence: "DOS; bill date; CARC/RARC; CPT; modifier; note", review: "Validated" },
    { account: "MAYO-000207", state: "Paid short", cause: "Expected reimbursement variance", action: "Underpayment dispute", confidence: "74%", evidence: "835 lines; payment; expected reimbursement", review: "Needs review" },
    { account: "MAYO-000233", state: "Resubmitted, pending", cause: "No final adjudication", action: "Re-status", confidence: "69%", evidence: "Resubmission date; payer; account age; notes", review: "Needs review" },
    { account: "MAYO-000261", state: "Denied", cause: "Medical necessity denial", action: "Appeal", confidence: "88%", evidence: "CARC/RARC; ICD-10; CPT; auth; notes", review: "Validated" },
  ],
  patterns: [
    { id: "PAT-001", title: "Late initial billing with filing-limit evidence", accounts: 14, consistency: 92, fields: ["date_of_service", "bill_date", "account_age", "payer_filing_limit"], status: "New", examples: "MAYO-000184, MAYO-000233, MAYO-000261" },
    { id: "PAT-002", title: "Short payment with missing contracted rate", accounts: 9, consistency: 78, fields: ["payment_by_line", "expected_reimbursement", "contracted_rate"], status: "Needs Operations review", examples: "MAYO-000207, MAYO-000318, MAYO-000402" },
  ],
  outputFile: {
    fileName: "mayo-classification-output.csv",
    rows: [
      { account: "MAYO-000184", history: "Evidence-linked chronological history", state: "Denied, unpaid", cause: "Missing modifier after coding denial", action: "Correct and rebill", confidence: "0.91", fields: "DOS; bill date; CARC/RARC; CPT; modifier; note" },
      { account: "MAYO-000207", history: "Evidence-linked chronological history", state: "Paid short", cause: "Expected reimbursement variance", action: "Underpayment dispute", confidence: "0.74", fields: "835 lines; payment; expected reimbursement" },
    ],
  },
  hitl: {
    account: "MAYO-000207",
    history: [
      { date: "03 Jun", event: "Service delivered", detail: "inventory.date_of_service" },
      { date: "08 Jun", event: "Claim billed", detail: "inventory.bill_date" },
      { date: "21 Jun", event: "Remittance", detail: "Two lines paid, one reduced" },
      { date: "Current", event: "Paid short", detail: "Unresolved balance" },
    ],
    fields: ["payment_by_line", "expected_reimbursement", "CARC", "balance_due", "note_text"],
    recommendation: "Underpayment dispute",
    confidence: "74%",
    missing: "contracted rate reference. Human review required.",
    outcomeOptions: ["Accept", "Correct", "Escalate"],
    actionOptions: ["Underpayment dispute", "Correct and rebill", "Re-status", "Appeal", "No action"],
  },
  validation: {
    metrics: [
      { label: "Adjudicated", value: "8", detail: "Locked outcomes" },
      { label: "Action exact match", value: "75%", detail: "6 of 8" },
      { label: "Evidence support", value: "96%", detail: "Material assertions" },
      { label: "Override rate", value: "25%", detail: "Reason coded" },
    ],
    considerations: [
      "Report metrics by payer, action and confidence.",
      "Do not use historical write-offs as answer keys.",
      "Review critical errors independently from aggregate accuracy.",
      "Promote only versioned rules, agents and workflows that pass gates.",
    ],
  },
  audit: [
    { time: "Now", event: "Review saved", actor: "Operations SME", object: "MAYO-000207" },
    { time: "11:20", event: "Workflow published", actor: "Technology Admin", object: "Workflow v2" },
    { time: "10:05", event: "Run completed", actor: "System", object: "RUN-001" },
    { time: "09:40", event: "Rule package published", actor: "Rule Admin", object: "Mayo Rules v3" },
  ],
};

const fsl: TenantData = {
  id: "fsl",
  name: "FSL",
  shortName: "FSL",
  phaseLabel: "FSL Phase 1",
  environment: "Test",
  duration: "2-3 months",
  overview: {
    title: "FSL Phase 1 lifecycle",
    subtitle:
      "An evidence-led receivables intelligence workflow tuned for FSL payer mix and governed review.",
    stats: [
      { label: "Sample accounts", value: "25", hint: "Closed accounts first" },
      { label: "Approved sources", value: "3", hint: "Cross-source correlation" },
      { label: "Configured agents", value: "6", hint: "Versioned contracts" },
      { label: "Review queue", value: "5", hint: "Evidence and risk triggers" },
    ],
    lifecycleSteps: [
      "Rules",
      "Upload",
      "Validate",
      "Agents",
      "Workflow",
      "Process",
      "Patterns",
      "Output",
      "HITL",
      "Measure",
    ],
    policyNote:
      "Closed and settled accounts provide positive path evidence. Disputed balances remain context until FSL Operations adjudicates them.",
  },
  projectSetup: {
    project: "FSL Phase 1 POC",
    periodOptions: ["Last 60 days", "Last 90 days", "Last 6 months", "Last 12 months"],
    groundTruthOptions: ["Settled accounts first", "Disputes adjudicated", "All historical outcomes"],
    goal: "Rebuild the receivable lifecycle, correlate settlement evidence, determine current state/root cause and recommend one approved action.",
  },
  rules: {
    items: [
      { id: "F-002", name: "Statement cycle breach", category: "Billing", version: "v2", status: "Published" },
      { id: "F-005", name: "Dispute response window", category: "Dispute", version: "v1", status: "Draft" },
      { id: "F-009", name: "Short settlement evidence", category: "Financial", version: "v3", status: "Published" },
    ],
    thenOptions: [
      "Action = DISPUTE; HITL = Required",
      "Action = WRITE_OFF; HITL = Required",
      "Action = ESCALATE; HITL = Optional",
      "Action = NO_ACTION; HITL = None",
    ],
    defaultRuleName: "Dispute evidence and deadline",
    defaultWhen:
      "dispute_is_open = true AND response_deadline >= today AND supporting_evidence = true",
    defaultSource: "FSL SOP | Operations",
    simulateResult: "Simulation complete: 21 accounts matched, 1 conflict.",
  },
  dataSources: {
    items: [
      { name: "FSL ledger extract", system: "Data warehouse", status: "Ready", rows: "480 rows" },
      { name: "Settlement advices", system: "Bank feed, line-level", status: "Ready", rows: "912 rows" },
      { name: "Collections activity", system: "CRM export", status: "Access check" },
      { name: "Customer correspondence", system: "Consolidated mailbox file", status: "Pending" },
    ],
  },
  mappingQuality: {
    metrics: [
      { label: "Completeness", value: "88%", detail: "Required fields" },
      { label: "Cross-source match", value: "79%", detail: "Customer, invoice and line" },
      { label: "Exceptions", value: "34", detail: "Downloadable rows" },
    ],
    mappings: [
      { source: "Ledger", sourceField: "Cust Ref", canonicalField: "account_id", status: "Mapped" },
      { source: "Settlement", sourceField: "ADV-REF", canonicalField: "settlement_reference", status: "Mapped" },
      { source: "Settlement", sourceField: "Value Date", canonicalField: "payment_date", status: "Mapped" },
      { source: "Correspondence", sourceField: "Logged On", canonicalField: "note_date", status: "Review" },
    ],
    validateResult: "Validation complete. 34 exceptions found.",
    warning:
      "Unmapped customer identifiers, privacy violations or invalid date/amount structures block processing.",
  },
  agents: [
    { name: "Data Validation Agent", schema: "DataValidationOutput v1", description: "Validate ledger completeness, mappings, joins and contradictions." },
    { name: "Timeline Reconstruction Agent", schema: "TimelineOutput v1", description: "Reconstruct the ordered receivable timeline from supplied evidence." },
    { name: "Evidence Correlation Agent", schema: "EvidenceCorrelationOutput v1", description: "Correlate settlement, ledger and correspondence evidence." },
    { name: "State & Root Cause Agent", schema: "StateCauseOutput v1", description: "Determine the current balance state and supported root cause." },
    { name: "Next Action Agent", schema: "NextActionOutput v1", description: "Recommend the next compliant collection action." },
    { name: "Review Routing Agent", schema: "ReviewRoutingOutput v1", description: "Route uncertain or high-value results for human review." },
  ],
  workflow: {
    name: "FSL Evidence Workflow v1",
    agents: [
      { id: 1, name: "Data Validation Agent", enabled: true },
      { id: 2, name: "Timeline Reconstruction Agent", enabled: true },
      { id: 3, name: "Evidence Correlation Agent", enabled: true },
      { id: 4, name: "State & Root Cause Agent", enabled: true },
      { id: 5, name: "Next Action Agent", enabled: true },
      { id: 6, name: "Review Routing Agent", enabled: false },
    ],
  },
  pocRuns: {
    stages: ["Rules applied", "Timeline built", "Evidence correlated", "State & cause", "Action", "Review route"],
    dataset: "FSL settled sample v1",
    workflow: "Workflow v1",
    runs: [
      { id: "RUN-001", accounts: 25, dataset: "FSL settled sample v1", workflow: "Workflow v1", status: "Completed" },
    ],
  },
  accountResults: [
    { account: "FSL-004512", state: "Partially settled", cause: "Deduction without backup", action: "Deduction dispute", confidence: "83%", evidence: "Invoice; advice lines; deduction code; note", review: "Validated" },
    { account: "FSL-004587", state: "Unpaid, overdue", cause: "Invoice never delivered", action: "Reissue invoice", confidence: "77%", evidence: "Invoice date; delivery log; customer contact", review: "Needs review" },
    { account: "FSL-004610", state: "In dispute", cause: "Pricing mismatch against contract", action: "Escalate to account owner", confidence: "65%", evidence: "Contract rate; invoice line; correspondence", review: "Needs review" },
    { account: "FSL-004698", state: "Settled short", cause: "Unapplied credit note", action: "Apply credit and close", confidence: "90%", evidence: "Credit note; advice; ledger balance", review: "Validated" },
  ],
  patterns: [
    { id: "PAT-101", title: "Repeat deductions without supporting backup", accounts: 22, consistency: 88, fields: ["deduction_code", "advice_line", "invoice_amount", "backup_present"], status: "New", examples: "FSL-004512, FSL-004698, FSL-004733" },
    { id: "PAT-102", title: "Delivery failures preceding overdue balances", accounts: 11, consistency: 71, fields: ["invoice_date", "delivery_log", "customer_contact"], status: "Needs Operations review", examples: "FSL-004587, FSL-004610, FSL-004801" },
  ],
  outputFile: {
    fileName: "fsl-classification-output.csv",
    rows: [
      { account: "FSL-004512", history: "Evidence-linked chronological history", state: "Partially settled", cause: "Deduction without backup", action: "Deduction dispute", confidence: "0.83", fields: "Invoice; advice lines; deduction code; note" },
      { account: "FSL-004587", history: "Evidence-linked chronological history", state: "Unpaid, overdue", cause: "Invoice never delivered", action: "Reissue invoice", confidence: "0.77", fields: "Invoice date; delivery log; customer contact" },
    ],
  },
  hitl: {
    account: "FSL-004587",
    history: [
      { date: "12 Apr", event: "Goods delivered", detail: "ledger.delivery_date" },
      { date: "15 Apr", event: "Invoice raised", detail: "ledger.invoice_date" },
      { date: "02 May", event: "Delivery bounce logged", detail: "Customer mailbox rejection" },
      { date: "Current", event: "Unpaid, overdue", detail: "Full balance outstanding" },
    ],
    fields: ["invoice_date", "delivery_log", "customer_contact", "balance_due", "note_text"],
    recommendation: "Reissue invoice",
    confidence: "77%",
    missing: "confirmed billing contact. Human review required.",
    outcomeOptions: ["Accept", "Correct", "Escalate"],
    actionOptions: ["Reissue invoice", "Deduction dispute", "Apply credit and close", "Escalate to account owner", "No action"],
  },
  validation: {
    metrics: [
      { label: "Adjudicated", value: "20", detail: "Locked outcomes" },
      { label: "Action exact match", value: "80%", detail: "16 of 20" },
      { label: "Evidence support", value: "92%", detail: "Material assertions" },
      { label: "Override rate", value: "20%", detail: "Reason coded" },
    ],
    considerations: [
      "Report metrics by customer segment, action and confidence.",
      "Do not use historical write-offs as answer keys.",
      "Review critical errors independently from aggregate accuracy.",
      "Promote only versioned rules, agents and workflows that pass gates.",
    ],
  },
  audit: [
    { time: "Now", event: "Review saved", actor: "Operations SME", object: "FSL-004587" },
    { time: "12:05", event: "Workflow published", actor: "Technology Admin", object: "Workflow v1" },
    { time: "10:40", event: "Run completed", actor: "System", object: "RUN-001" },
    { time: "09:15", event: "Rule package published", actor: "Rule Admin", object: "FSL Rules v2" },
  ],
};

export const TENANTS: Record<TenantId, TenantData> = { mayo, fsl };

export const TENANT_LIST: TenantData[] = [mayo, fsl];

export const DEFAULT_TENANT_ID: TenantId = "mayo";
