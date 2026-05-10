import axios from 'axios';

export const createAxiosClient = ({ config, tokenStorage, authService, axiosOptions = {} }) => {
  const client = axios.create({
    baseURL: config.baseUrl,
    timeout: 20000,
    ...axiosOptions,
  });

  let refreshInFlight = null;

  client.interceptors.request.use((request) => {
    const nextRequest = { ...request, headers: { ...(request.headers || {}) } };
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken) {
      nextRequest.headers.Authorization = `${config.AUTH_HEADER_PREFIX} ${accessToken}`;
    }

    return nextRequest;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error?.response?.status;
      const originalRequest = error?.config || {};

      if (status !== 401 || originalRequest.__isRetryRequest) {
        return Promise.reject(error);
      }

      try {
        originalRequest.__isRetryRequest = true;

        if (!refreshInFlight) {
          refreshInFlight = authService.refresh().finally(() => {
            refreshInFlight = null;
          });
        }

        const newAccessToken = await refreshInFlight;

        if (!newAccessToken) {
          await authService.logout({ callApi: false });
          return Promise.reject(error);
        }

        originalRequest.headers = {
          ...(originalRequest.headers || {}),
          Authorization: `${config.AUTH_HEADER_PREFIX} ${newAccessToken}`,
        };

        return client(originalRequest);
      } catch (refreshError) {
        await authService.logout({ callApi: false });
        return Promise.reject(refreshError);
      }
    },
  );

  return client;
};
