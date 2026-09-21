import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_ROLE_ID, type RoleId } from "@/data/roles";
import { DEFAULT_TENANT_ID, type TenantId } from "@/data/tenants";

export interface UserInfo {
  name: string;
  email: string;
  signedInAt: string;
}

interface UserState {
  user: UserInfo | null;
  tenantId: TenantId;
  roleId: RoleId;
  setUser: (user: UserInfo | null) => void;
  setTenantId: (tenantId: TenantId) => void;
  setRoleId: (roleId: RoleId) => void;
  signOut: () => void;
}

/**
 * Persisted user store — the single place to read the signed-in user,
 * active tenant and role from anywhere (components, API helpers, etc.):
 *
 *   const email = useUserStore((s) => s.user?.email);
 *   const tenantId = useUserStore((s) => s.tenantId);
 *
 * Outside React (e.g. API call builders):
 *   const { user, tenantId } = useUserStore.getState();
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      tenantId: DEFAULT_TENANT_ID,
      roleId: DEFAULT_ROLE_ID,
      setUser: (user) => set({ user }),
      setTenantId: (tenantId) => set({ tenantId }),
      setRoleId: (roleId) => set({ roleId }),
      signOut: () => set({ user: null }),
    }),
    { name: "rm-agentic-ai-user" },
  ),
);
