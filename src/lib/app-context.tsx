import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_TENANT_ID,
  TENANTS,
  type TenantData,
  type TenantId,
} from "@/data/tenants";
import { DEFAULT_ROLE_ID, getRole, type Role, type RoleId } from "@/data/roles";

const TENANT_KEY = "rm-agentic-ai-tenant";
const ROLE_KEY = "rm-agentic-ai-role";

function readTenant(): TenantId {
  if (typeof window === "undefined") return DEFAULT_TENANT_ID;
  const stored = window.localStorage.getItem(TENANT_KEY);
  return stored === "mayo" || stored === "fsl" ? stored : DEFAULT_TENANT_ID;
}

function readRole(): RoleId {
  if (typeof window === "undefined") return DEFAULT_ROLE_ID;
  const stored = Number(window.localStorage.getItem(ROLE_KEY));
  return stored === 1 || stored === 2 || stored === 3 || stored === 4
    ? (stored as RoleId)
    : DEFAULT_ROLE_ID;
}

interface AppContextValue {
  tenantId: TenantId;
  tenant: TenantData;
  setTenantId: (id: TenantId) => void;
  roleId: RoleId;
  role: Role;
  setRoleId: (id: RoleId) => void;
  canAccess: (menuItem: string) => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [tenantId, setTenantIdState] = useState<TenantId>(readTenant);
  const [roleId, setRoleIdState] = useState<RoleId>(readRole);

  const setTenantId = useCallback((id: TenantId) => {
    setTenantIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(TENANT_KEY, id);
  }, []);

  const setRoleId = useCallback((id: RoleId) => {
    setRoleIdState(id);
    if (typeof window !== "undefined") window.localStorage.setItem(ROLE_KEY, String(id));
  }, []);

  const value = useMemo<AppContextValue>(() => {
    const role = getRole(roleId);
    return {
      tenantId,
      tenant: TENANTS[tenantId],
      setTenantId,
      roleId,
      role,
      setRoleId,
      canAccess: (menuItem: string) => role.menu.includes(menuItem),
    };
  }, [tenantId, roleId, setTenantId, setRoleId]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
