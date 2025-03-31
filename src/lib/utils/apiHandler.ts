/* eslint-disable @typescript-eslint/no-explicit-any */

interface ApiResponse<T = any> {
  data: T | null;
  error: string | null;
  status: number;
  success: boolean;
}

/**
 * Handles API responses in a consistent manner
 * @param response - The fetch response object
 * @returns Standardized API response object
 */
export async function handleApiResponse<T>(
  response: Response
): Promise<ApiResponse<T>> {
  try {
    const data = await response.json();

    if (!response.ok) {
      return {
        data: null,
        error: data.message || "Something went wrong",
        status: response.status,
        success: false,
      };
    }

    return {
      data,
      error: null,
      status: response.status,
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      status: response.status || 500,
      success: false,
    };
  }
}

/**
 * Generic fetch wrapper with error handling
 */
export async function fetchApi<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

    return handleApiResponse<T>(response);
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : "Network error",
      status: 500,
      success: false,
    };
  }
}
