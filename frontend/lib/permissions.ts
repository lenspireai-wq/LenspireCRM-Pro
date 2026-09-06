export type Department = "sales" | "operations" | "accounts" | "production";
export type AccessLevel = "none" | "read" | "full";

export type SessionUser = {
  id: number;
  username: string;
  display_name: string;
  mobile?: string;
  role: string;
  is_staff?: boolean;
  is_superuser?: boolean;
  is_platform_owner?: boolean;
  is_active?: boolean;
  date_joined?: string;
  last_login?: string | null;
  department_access: Partial<Record<Department, AccessLevel>>;
};

export const departments: Department[] = [
  "sales",
  "operations",
  "accounts",
  "production",
];

export const isAdministrator = (user: SessionUser | null) =>
  Boolean(
    user &&
    (user.is_superuser ||
      user.is_staff ||
      user.role?.trim().toLowerCase() === "administrator"),
  );

export const accessLevel = (
  user: SessionUser | null,
  department: Department,
): AccessLevel => {
  if (isAdministrator(user)) return "full";
  const value = user?.department_access?.[department];
  return value === "read" || value === "full" ? value : "none";
};

export const canAccess = (user: SessionUser | null, department: Department) =>
  accessLevel(user, department) !== "none";

export const canWrite = (user: SessionUser | null, department: Department) =>
  accessLevel(user, department) === "full";
