import { useState, useEffect, useCallback } from "react";
import { RoleService } from "@/services/RoleService";
import { Role } from "../types";

export const useRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getAllRoles();
      setRoles(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch roles.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoleById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await RoleService.getRoleById(id);
      setSelectedRole(data);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch role.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return {
    roles,
    selectedRole,
    loading,
    error,
    fetchRoles,
    fetchRoleById,
  };
};
