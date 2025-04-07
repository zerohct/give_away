export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  phone?: string;
  role: string;
  avatar?: string;
}
export interface CreateUserData {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    password?: string;
    phone?: string;
  };
  roles?: string;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
  roles?: string;
}
