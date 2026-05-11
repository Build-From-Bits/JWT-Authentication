import { createAuthSystem } from '../src/index.js';

const API_BASE_URL = 'http://localhost:8000';

const auth = createAuthSystem({
  baseUrl: API_BASE_URL,
  env: typeof window !== 'undefined' ? window : {},
});

const log = (...args) => {
  // eslint-disable-next-line no-console
  console.log('[JWT Authentication demo]', ...args);
};

async function runDemo() {
  log('Starting session bootstrap...');
  const bootstrap = await auth.session.initialize();
  log('Bootstrap result:', bootstrap);

  if (!auth.session.isAuthenticated()) {
    log('No valid session. Attempting login...');

    const username = 'demo_user';
    const password = 'demo_password';

    try {
      const loginResult = await auth.authService.login({ username, password });
      log('Login success:', {
        hasAccessToken: Boolean(loginResult.accessToken),
        hasRefreshToken: Boolean(loginResult.refreshToken),
      });
    } catch (error) {
      log('Login failed:', error?.response?.data || error.message);
      return;
    }
  }

  try {
    log('Calling protected endpoint with axios wrapper...');
    const response = await auth.client.get('/v2/user/profile/');
    log('Protected API success:', response.data);
  } catch (error) {
    log('Protected API failed:', error?.response?.data || error.message);
  }
}

runDemo();
