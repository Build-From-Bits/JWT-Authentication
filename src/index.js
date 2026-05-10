import { buildAuthConfig } from './env.js';
import { createTokenStorage } from './tokenStorage.js';
import { createAuthService } from './authService.js';
import { createAxiosClient } from './axiosClient.js';
import { createSessionManager } from './session.js';

export const createAuthSystem = ({
  baseUrl = '',
  env = {},
  configOverrides = {},
  tokenKeys = {},
  authAxiosOptions = {},
  clientAxiosOptions = {},
} = {}) => {
  const config = buildAuthConfig({
    baseUrl,
    env,
    overrides: configOverrides,
  });

  const tokenStorage = createTokenStorage(tokenKeys);

  const authService = createAuthService({
    config,
    tokenStorage,
    axiosOptions: authAxiosOptions,
  });

  const client = createAxiosClient({
    config,
    tokenStorage,
    authService,
    axiosOptions: clientAxiosOptions,
  });

  const session = createSessionManager({
    tokenStorage,
    authService,
  });

  return {
    config,
    tokenStorage,
    authService,
    client,
    session,
  };
};

export { buildAuthConfig } from './env.js';
export { createTokenStorage, tokenStorage } from './tokenStorage.js';
