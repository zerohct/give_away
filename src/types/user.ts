export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  phone?: string;
  status?: string;
  role: string;
  avatar?: string;
}
