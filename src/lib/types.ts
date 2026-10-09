export type UserRole = "admin" | "member";
export type UserStatus = "active" | "inactive";

export interface PublicUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface DashboardMetrics {
  totalUsers: number;
  activeUsers: number;
}
