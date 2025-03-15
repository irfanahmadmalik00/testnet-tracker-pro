
// Environment variables utility

/**
 * Get the API URL from environment variables
 */
export const getApiUrl = (): string => {
  return import.meta.env.VITE_API_URL || 'http://localhost:3000';
};

/**
 * Check if the app is running in production
 */
export const isProduction = (): boolean => {
  return import.meta.env.NODE_ENV === 'production';
};

/**
 * Get an environment variable value
 */
export const getEnvVar = (key: string): string | undefined => {
  return import.meta.env[key];
};
