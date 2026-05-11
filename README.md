# JWT Authentication

Minimal browser-side JWT auth library with:
- login (username/password)
- access token in `sessionStorage`
- refresh token in `localStorage`
- axios auth header injection
- automatic token refresh on `401`
- startup session bootstrap (`verify access`, then `refresh` fallback)
- logout clears both local tokens by default (no server endpoint needed)

## Install

```bash
npm install @truflect/jwt-authentication
```

## Default Auth Paths

- `AUTH_LOGIN_PATH`: `/v2/auth/token/`
- `AUTH_REFRESH_PATH`: `/v2/auth/token/refresh/`
- `AUTH_VERIFY_PATH`: `/v2/auth/token/verify/`

`AUTH_LOGOUT_PATH` is optional and empty by default.

## Basic Setup

```js
import { createAuthSystem } from '@truflect/jwt-authentication';

const auth = createAuthSystem({
  baseUrl: 'https://your-api.example.com',
  env: process.env,
});
```

## Override Config At Setup Time

```js
const auth = createAuthSystem({
  baseUrl: 'https://api.example.com',
  env: process.env,
  configOverrides: {
    AUTH_LOGIN_PATH: '/custom/auth/login/',
    AUTH_REFRESH_PATH: '/custom/auth/refresh/',
    AUTH_VERIFY_PATH: '/custom/auth/verify/',
    AUTH_HEADER_PREFIX: 'Bearer',
    REFRESH_REQUEST_KEY: 'refresh_token',
    VERIFY_REQUEST_KEY: 'access_token',

    // Optional only if backend supports logout API
    AUTH_LOGOUT_PATH: '/custom/auth/logout/',
    LOGOUT_REQUEST_KEY: 'refresh_token',
    ENABLE_LOGOUT_API_CALL: false,
  },
  tokenKeys: {
    accessTokenKey: 'my_access_token',
    refreshTokenKey: 'my_refresh_token',
  },
});
```

## Usage

```js
const { authService, client, session } = createAuthSystem({
  baseUrl: 'http://localhost:8000',
  env: process.env,
});

await session.initialize();
await authService.login({ username: 'demo', password: 'demo123' });

const response = await client.get('/v2/user/profile/');
console.log(response.data);

await authService.logout();
```

## Publish Scripts

```bash
npm run pack:check
npm run publish:npm
npm run publish:github
```

## GitHub Actions Release + Publish

Workflow file:
- `.github/workflows/release.yml`

On push to `main`, it:
1. runs pre-release checks (`npm run pack:check`)
2. reads version from `package.json`
3. creates tag `v<version>` if not already present
4. creates a GitHub release
5. publishes package to GitHub Packages (`npm.pkg.github.com`)

For GitHub Packages, ensure repository/package permissions allow publish.

## Browser Demo

A minimal browser demo is included:
- `example/index.html`
- `example/browser-demo.js`

Run it with any static server from project root:

```bash
npx serve .
```

Then open:
- `http://localhost:3000/example/`

Update `username`, `password`, and API URL in `example/browser-demo.js` for your backend.
