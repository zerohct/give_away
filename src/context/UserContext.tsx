// src/context/UserContext.tsx
import { useState, useEffect, useCallback } from "react";
import { UserService } from "@/services/UserService";
import { CreateUserData, UpdateUserData, User } from "../types";

export const useUser = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    console.log("fetchUsers called");
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Failed to fetch users list.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserById = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await UserService.getUserById(Number(id));
      setCurrentUser(data);
      return data;
    } catch (err: any) {
      setError(err.message || `Failed to fetch user #${id}.`);
      setCurrentUser(null);
      throw err; // Re-throw to allow handling in components
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData: CreateUserData) => {
    setLoading(true);
    setError(null);
    try {
      const newUser = await UserService.createUser(userData);
      setUsers((prev) => [...prev, newUser]);
      return newUser;
    } catch (err: any) {
      setError(err.message || "Failed to create user.");
      throw err; // Re-throw to allow handling in components
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(
    async (id: string | number, updateData: UpdateUserData) => {
      setLoading(true);
      setError(null);
      try {
        const updatedUser = await UserService.updateUser(
          Number(id),
          updateData
        );
        setUsers((prev) =>
          prev.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
        }
        return updatedUser;
      } catch (err: any) {
        setError(err.message || `Failed to update user #${id}.`);
        throw err; // Re-throw to allow handling in components
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  const deleteUser = useCallback(
    async (id: string | number) => {
      setLoading(true);
      setError(null);
      try {
        await UserService.deleteUser(Number(id));
        setUsers((prev) => prev.filter((user) => user.id !== Number(id)));
        if (currentUser?.id === Number(id)) {
          setCurrentUser(null);
        }
        return true;
      } catch (err: any) {
        setError(err.message || `Failed to delete user #${id}.`);
        throw err; // Re-throw to allow handling in components
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    currentUser,
    loading,
    error,
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
  };
};
