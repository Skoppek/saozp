export interface UserAdminData {
  sessionId?: string;
  isAdmin?: boolean;
  sessionExpiryDate?: Date;
  login: string;
  firstName: string;
  lastName: string;
  userId: number;
}

export interface UserAdminDataFilter {
  id: string;
  login: string;
  firstName: string;
  lastName: string;
  isAdmin?: boolean;
  hasSession?: boolean;
}
