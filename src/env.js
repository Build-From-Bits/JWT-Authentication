export const readEnv = (envObject = {}, ...keys) => {
  for (let index = 0; index < keys.length; index += 1) {
    const value = envObject[keys[index]];
    if (typeof value === 'string' && value.trim() !== '') {
      return value;
    }
  }
  return undefined;
};

export const buildAuthConfig = ({ env = {}, baseUrl = '', overrides = {} } = {}) => {
  const AUTH_LOGIN_PATH =
    overrides.AUTH_LOGIN_PATH ||
    readEnv(env, 'AUTH_LOGIN_PATH', 'REACT_APP_AUTH_LOGIN_PATH') ||
    '/v2/auth/token/';

  const AUTH_REFRESH_PATH =
    overrides.AUTH_REFRESH_PATH ||
    readEnv(env, 'AUTH_REFRESH_PATH', 'REACT_APP_AUTH_REFRESH_PATH') ||
    '/v2/auth/token/refresh/';

  const AUTH_VERIFY_PATH =
    overrides.AUTH_VERIFY_PATH ||
    readEnv(env, 'AUTH_VERIFY_PATH', 'REACT_APP_AUTH_VERIFY_PATH') ||
    '/v2/auth/token/verify/';

  const AUTH_LOGOUT_PATH =
    overrides.AUTH_LOGOUT_PATH ||
    readEnv(env, 'AUTH_LOGOUT_PATH', 'REACT_APP_AUTH_LOGOUT_PATH') ||
    '';

  return {
    baseUrl: overrides.baseUrl || baseUrl,
    AUTH_LOGIN_PATH,
    AUTH_REFRESH_PATH,
    AUTH_VERIFY_PATH,
    AUTH_LOGOUT_PATH,
    AUTH_HEADER_PREFIX: overrides.AUTH_HEADER_PREFIX || 'JWT',
    REFRESH_REQUEST_KEY: overrides.REFRESH_REQUEST_KEY || 'refresh',
    VERIFY_REQUEST_KEY: overrides.VERIFY_REQUEST_KEY || 'token',
    LOGOUT_REQUEST_KEY: overrides.LOGOUT_REQUEST_KEY || 'refresh',
    LOGIN_USERNAME_KEY: overrides.LOGIN_USERNAME_KEY || 'username',
    ENABLE_LOGOUT_API_CALL:
      typeof overrides.ENABLE_LOGOUT_API_CALL === 'boolean' ? overrides.ENABLE_LOGOUT_API_CALL : false,
  };
};
