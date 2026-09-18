export type RoleId = 1 | 2 | 3 | 4;

export interface Role {
  id: RoleId;
  name: string;
  description: string;
  /** Sidebar items this role may open. */
  menu: string[];
  /** Optional display aliases for menu items in the sidebar. */
  menuLabels?: Record<string, string>;
  /** Whether this role may open the /simulate role-switcher page. */
  canSimulate: boolean;
}

export const ALL_MENU_ITEMS = [
  "Overview",
  "Project Setup",
  "Rules",
  "Data Sources",
  "Mapping & Quality",
  "Agent Configuration",
  "Workflow Designer",
  "POC Runs",
  "Account Results",
  "New Patterns",
  "Output File",
  "HITL",
  "Validation",
  "Audit & Versions",
];

export const ROLES: Role[] = [
  {
    id: 1,
    name: "Super Admin",
    description: "Full access to every configuration, run and audit surface.",
    menu: ALL_MENU_ITEMS,
    canSimulate: true,
  },
  {
    id: 2,
    name: "Admin",
    description: "Full access except agent model configuration.",
    menu: ALL_MENU_ITEMS.filter((item) => item !== "Agent Configuration"),
    canSimulate: false,
  },
  {
    id: 3,
    name: "Technology Admin",
    description: "Configuration, data and workflow surfaces without human review.",
    menu: ALL_MENU_ITEMS.filter((item) => item !== "HITL"),
    canSimulate: false,
  },
  {
    id: 4,
    name: "Operations SMEs",
    description: "Limited review-focused menu for operations reviewers.",
    menu: ["Overview", "HITL", "Account Results", "Validation"],
    menuLabels: {
      HITL: "Validation Queue",
      Validation: "Validation History",
    },
    canSimulate: false,
  },
];

export const DEFAULT_ROLE_ID: RoleId = 1;

export function getRole(id: RoleId): Role {
  return ROLES.find((role) => role.id === id) ?? ROLES[0]!;
}
