import dotenv from 'dotenv';

const SERVICE_URL_REGEX = /^SERVICE_URL_/;

export function loadConfig(options = {}) {
  dotenv.config({ path: options.path });

  const { NODE_ENV, PORT, ...rest } = process.env;

  if (!NODE_ENV) {
    throw new Error('NODE_ENV is not set');
  }

  const serviceUrls = {};
  for (const [key, value] of Object.entries(rest)) {
    if (SERVICE_URL_REGEX.test(key) && value) {
      serviceUrls[key] = value;
    }
  }

  return {
    NODE_ENV,
    port: PORT ? parseInt(PORT, 10) : 3000,
    ...serviceUrls,
  };
}
