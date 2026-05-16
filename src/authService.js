import axios from 'axios';

const normalizeAuthPayload = (payload = {}) => ({
  accessToken: payload.access || payload.accessToken,
  refreshToken: payload.refresh || payload.refreshToken,
});

export const createAuthService = ({ config, tokenStorage, axiosOptions = {} }) => {
  const authHttp = axios.create({
    baseURL: config.baseUrl,
    timeout: 15000,
    ...axiosOptions,
  });

  const login = async ({ username, password, ...extraPayload }) => {
    const response = await authHttp.post(config.AUTH_LOGIN_PATH, {
      [config.LOGIN_USERNAME_KEY]: username,
      password,
      ...extraPayload,
    });

    const { accessToken, refreshToken } = normalizeAuthPayload(response?.data);
    if (!accessToken || !refreshToken) {
      throw new Error('Login response must include access and refresh token');
    }

    tokenStorage.setTokens({ accessToken, refreshToken });
    return { accessToken, refreshToken, raw: response.data };
  };

  const refresh = async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) return null;

    const response = await authHttp.post(config.AUTH_REFRESH_PATH, {
      [config.REFRESH_REQUEST_KEY]: refreshToken,
    });

    const { accessToken, refreshToken: nextRefreshToken } = normalizeAuthPayload(response?.data);
    if (!accessToken) return null;

    tokenStorage.setAccessToken(accessToken);
    if (nextRefreshToken) tokenStorage.setRefreshToken(nextRefreshToken);

    return accessToken;
  };

  const verify = async (accessToken) => {
    if (!accessToken) return false;

    try {
      await authHttp.post(config.AUTH_VERIFY_PATH, {
        [config.VERIFY_REQUEST_KEY]: accessToken,
      });
      return true;
    } catch (_error) {
      return false;
    }
  };

  const logout = async ({ callApi = config.ENABLE_LOGOUT_API_CALL } = {}) => {
    const refreshToken = tokenStorage.getRefreshToken();

    try {
      if (callApi && config.AUTH_LOGOUT_PATH && refreshToken) {
        await authHttp.post(config.AUTH_LOGOUT_PATH, {
          [config.LOGOUT_REQUEST_KEY]: refreshToken,
        });
      }
    } finally {
      tokenStorage.clearTokens();
    }

    return { success: true };
  };

  return {
    login,
    refresh,
    verify,
    logout,
  };
};
