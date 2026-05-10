const hasWindow = () => typeof window !== 'undefined';

export const createTokenStorage = ({ accessTokenKey = 'accessToken', refreshTokenKey = 'refreshToken' } = {}) => ({
  getAccessToken() {
    if (!hasWindow()) return null;
    return window.sessionStorage.getItem(accessTokenKey);
  },

  getRefreshToken() {
    if (!hasWindow()) return null;
    return window.localStorage.getItem(refreshTokenKey);
  },

  setAccessToken(token) {
    if (!hasWindow()) return;
    if (token) window.sessionStorage.setItem(accessTokenKey, token);
  },

  setRefreshToken(token) {
    if (!hasWindow()) return;
    if (token) window.localStorage.setItem(refreshTokenKey, token);
  },

  setTokens({ accessToken, refreshToken }) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  },

  clearAccessToken() {
    if (!hasWindow()) return;
    window.sessionStorage.removeItem(accessTokenKey);
  },

  clearRefreshToken() {
    if (!hasWindow()) return;
    window.localStorage.removeItem(refreshTokenKey);
  },

  clearTokens() {
    this.clearAccessToken();
    this.clearRefreshToken();
  },
});

export const tokenStorage = createTokenStorage();
