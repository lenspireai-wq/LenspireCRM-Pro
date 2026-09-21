import type { SessionUser } from "@/lib/permissions";

/** Trusted tenant identity from the authenticated API response. */
export const studioBrandName = (user?: Pick<SessionUser, "organization_name"> | null) =>
  user?.organization_name?.trim() || "Studio Workspace";

export const studioDocumentTitle = (user?: Pick<SessionUser, "organization_name"> | null, area?: string) =>
  area ? `${studioBrandName(user)} | ${area}` : studioBrandName(user);
