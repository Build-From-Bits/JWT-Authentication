# UI-JWT-Authentication

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
npm install @truflect/ui-jwt-authentication
```

## Default Auth Paths

- `AUTH_LOGIN_PATH`: `/v2/auth/token/`
- `AUTH_REFRESH_PATH`: `/v2/auth/token/refresh/`
- `AUTH_VERIFY_PATH`: `/v2/auth/token/verify/`

`AUTH_LOGOUT_PATH` is optional and empty by default.

## Basic Setup

```js
import { createAuthSystem } from '@truflect/ui-jwt-authentication';

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

// App bootstrap
await session.initialize();

// Login -> stores access in sessionStorage, refresh in localStorage
await authService.login({ username: 'demo', password: 'demo123' });

// Authenticated API call
const response = await client.get('/v2/user/profile/');
console.log(response.data);

// Logout -> clears both tokens locally
await authService.logout();
```

## Publish Scripts

```bash
npm run pack:check
npm run publish:npm
npm run publish:gitlab
```

`publish:gitlab` expects:
- `NPM_REGISTRY_URL` env var (for example `https://gitlab.com/api/v4/projects/<project_id>/packages/npm/`)
- auth token configured in `.npmrc`

Use `.npmrc.example` as template.

## GitLab CI Publish

Included file: `.gitlab-ci.yml`

- `validate:package` runs on branches/MRs
- `publish:gitlab-package` runs on tags and publishes to GitLab Package Registry

Tag-based release example:

```bash
git tag v0.1.1
git push origin v0.1.1
```

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
