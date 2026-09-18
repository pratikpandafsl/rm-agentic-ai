export interface TourStep {
  /** Sidebar menu item this step highlights. */
  menu: string;
  to: string;
  title: string;
  text: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    menu: "Rules",
    to: "/rules",
    title: "1. Rule creation",
    text: "Create, simulate, approve and publish deterministic rules.",
  },
  {
    menu: "Data Sources",
    to: "/data-sources",
    title: "2. Data upload",
    text: "Upload inventory, 835, worked/closed details and consolidated notes.",
  },
  {
    menu: "Mapping & Quality",
    to: "/mapping-quality",
    title: "3. Validate data",
    text: "Map canonical fields, run quality checks, match sources, then approve for test.",
  },
  {
    menu: "Agent Configuration",
    to: "/agent-configuration",
    title: "4. Configure agents",
    text: "Version prompts, models, tools, thresholds and output schemas.",
  },
  {
    menu: "Workflow Designer",
    to: "/workflow-designer",
    title: "5. Create workflow",
    text: "Order rules and six agents, configure retries and the review route.",
  },
  {
    menu: "POC Runs",
    to: "/poc-runs",
    title: "6. Process batch",
    text: "Execute a locked dataset and configuration snapshot.",
  },
  {
    menu: "New Patterns",
    to: "/new-patterns",
    title: "7. Show patterns separately",
    text: "Review novel or repeating cohorts without silently changing rules.",
  },
  {
    menu: "Output File",
    to: "/output-file",
    title: "8. Create output file",
    text: "Generate one row per account with classification, evidence and gaps.",
  },
  {
    menu: "HITL",
    to: "/hitl",
    title: "9. Human in the loop",
    text: "Operations accepts, corrects, rejects, requests data or escalates.",
  },
  {
    menu: "Validation",
    to: "/validation",
    title: "10. Validate and learn",
    text: "Measure only adjudicated outcomes. Feedback is curated, not automatically learned.",
  },
];
