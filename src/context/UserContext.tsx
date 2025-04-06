import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { TokenStorage } from "../services/TokenStorage";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  roles: { id: number; name: string }[];
}

interface CreateUserDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  status?: string;
  roleIds?: number[];
}

interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  status?: string;
  roleIds?: number[];
}

interface UserContextType {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<User | null>;
  createUser: (userData: CreateUserDTO) => Promise<User | null>;
  updateUser: (id: number, userData: UpdateUserDTO) => Promise<User | null>;
  deleteUser: (id: number) => Promise<boolean>;
  searchUsers: (query: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getAuthHeaders = () => {
  const token = TokenStorage.getAccessToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3000'; 
  const USERS_ENDPOINT = `${API_BASE_URL}/users`; // Để lấy tất cả người dùng
  const ADMIN_USERS_ENDPOINT = `${API_BASE_URL}/admin/users`; // Dành cho việc tạo, cập nhật, xóa

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(USERS_ENDPOINT, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setCurrentUser(data);
      return data;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserDTO) => {
    setLoading(true);
    setError(null);
    try {
      const { roleIds, ...rest } = userData;

      // Gói thông tin người dùng vào đối tượng `user` giống như API yêu cầu
      const payload = {
        user: {
          ...rest,
          roles: roleIds?.map(id => ({ id })) || [], // Tạo danh sách vai trò từ roleIds
        },
      };

      const response = await fetch(ADMIN_USERS_ENDPOINT, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload), // Gửi toàn bộ payload dưới dạng JSON
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create user: ${response.status}`);
      }

      const newUser = await response.json();
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating user');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (id: number, userData: UpdateUserDTO) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user: ${response.status}`);
      }

      const updatedUser = await response.json();
      setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      if (currentUser && currentUser.id === id) {
        setCurrentUser(updatedUser);
      }
      return updatedUser;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating user');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const deleteUser = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.status} ${response.statusText}`);
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
      if (currentUser && currentUser.id === id) {
        setCurrentUser(null);
      }
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while deleting user');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const searchUsers = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${USERS_ENDPOINT}/search?q=${encodeURIComponent(query)}`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to search users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred while searching users');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
