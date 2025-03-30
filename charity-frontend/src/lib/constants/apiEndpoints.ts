// lib/constants/apiEndpoints.ts

const API_BASE_URL = process.env.API_URL || "http://localhost:3000";

export const ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  },

  // Donations
  DONATIONS: {
    LIST: `${API_BASE_URL}/donations`,
    CREATE: `${API_BASE_URL}/donations`,
    DETAILS: (id: string) => `${API_BASE_URL}/donations/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/donations/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/donations/${id}`,
  },

  // Campaigns
  CAMPAIGNS: {
    LIST: `${API_BASE_URL}/campaigns`,
    CREATE: `${API_BASE_URL}/campaigns`,
    DETAILS: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/campaigns/${id}`,
    DONORS: (id: string) => `${API_BASE_URL}/campaigns/${id}/donors`,
  },

  // Volunteers
  VOLUNTEERS: {
    LIST: `${API_BASE_URL}/volunteers`,
    REGISTER: `${API_BASE_URL}/volunteers/register`,
    DETAILS: (id: string) => `${API_BASE_URL}/volunteers/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/volunteers/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/volunteers/${id}`,
    EVENTS: `${API_BASE_URL}/volunteers/events`,
  },

  // Events
  EVENTS: {
    LIST: `${API_BASE_URL}/events`,
    CREATE: `${API_BASE_URL}/events`,
    DETAILS: (id: string) => `${API_BASE_URL}/events/${id}`,
    UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,
    DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,
    REGISTER: (id: string) => `${API_BASE_URL}/events/${id}/register`,
  },

  // Users
  USERS: {
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    DONATION_HISTORY: `${API_BASE_URL}/users/donations`,
    VOLUNTEER_HISTORY: `${API_BASE_URL}/users/volunteer-history`,
  },
};
