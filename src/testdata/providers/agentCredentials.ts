import { ConfigurationException } from '../../exceptions';
import { LoginCredentials } from '../../pages/LoginPage';

/**
 * Resolves agent credentials from environment variables.
 * Never hardcode production credentials in source code.
 */
export function getAgentCredentials(): LoginCredentials {
  const username = process.env.AGENT_USERNAME?.trim();
  const password = process.env.AGENT_PASSWORD?.trim();

  if (!username || !password) {
    throw new ConfigurationException(
      'AGENT_USERNAME and AGENT_PASSWORD environment variables are required for authenticated scenarios. Set them in .env or your CI secret store.',
    );
  }

  return { username, password };
}

export function hasAgentCredentials(): boolean {
  return Boolean(
    process.env.AGENT_USERNAME?.trim() && process.env.AGENT_PASSWORD?.trim(),
  );
}
