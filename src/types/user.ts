export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  phone?: string;
  role: string;
  profileImage?: string;
}

export interface Role {
  id: number;
  name: string;
  description: string;
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
