export const ENV = new Map<string, string>();

/**
 * Loads and stores environment variables into the ENV Map.
 */
export const configEnv = () => {
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined) {
      ENV.set(key, value);
    }
  }
  console.log('[env] Loaded environment variables:');
};

/**
 * Helper to get an environment variable as a string
 */
export const getEnv = (key: string): string => {
  const val = ENV.get(key);
  if (!val) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return val;
};

/**
 * Helper to get an environment variable as a number
 */
export const getEnvNumber = (key: string): number => {
  const raw = getEnv(key);
  const num = Number(raw);
  if (isNaN(num)) throw new Error(`Missing environment variable: ${key}`);
  return num;
};