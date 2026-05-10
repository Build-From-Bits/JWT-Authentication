export const createSessionManager = ({ tokenStorage, authService }) => {
  const initialize = async () => {
    const accessToken = tokenStorage.getAccessToken();
    const refreshToken = tokenStorage.getRefreshToken();

    // Same session: verify access token first.
    if (accessToken) {
      const valid = await authService.verify(accessToken);
      if (valid) {
        return { authenticated: true, source: 'access-verified' };
      }
    }

    // New browser session: use refresh token to restore access token.
    if (refreshToken) {
      try {
        const newAccessToken = await authService.refresh();
        if (newAccessToken) {
          return { authenticated: true, source: 'refresh-restored' };
        }
      } catch (_error) {
        tokenStorage.clearTokens();
      }
    }

    tokenStorage.clearAccessToken();
    return { authenticated: false, source: 'none' };
  };

  const isAuthenticated = () => Boolean(tokenStorage.getAccessToken());

  return {
    initialize,
    isAuthenticated,
  };
};
