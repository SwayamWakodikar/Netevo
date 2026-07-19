import http from 'k6/http';
import { check, sleep, group } from 'k6';

// Random string generator for unique usernames/emails
function randomString(length) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const options = {
  scenarios: {
    // 1. Health check steady load
    health_check: {
      executor: 'constant-vus',
      vus: 5,
      duration: '10s',
      exec: 'healthCheck',
    },
    // 2. Test rate limiting by sending burst of requests (no sleep)
    rate_limiting: {
      executor: 'shared-iterations',
      vus: 30,
      iterations: 200, 
      maxDuration: '10s',
      exec: 'rateLimitCheck',
    },
    // 3. Auth service flow
    auth_flow: {
      executor: 'shared-iterations',
      vus: 5,
      iterations: 10,
      maxDuration: '30s',
      exec: 'authFlow',
    }
  },
};

const BASE_URL = 'http://localhost:8080';

export function healthCheck() {
  let res = http.get(`${BASE_URL}/health`);
  check(res, { 'health status 200': (r) => r.status === 200 });
  sleep(1);
}


export function rateLimitCheck() {
  // Blast requests without sleep to hit the 10r/s + 20 burst limit
  let res = http.get(`${BASE_URL}/health`);
  check(res, { 
    'rate limit status is 200 or 503': (r) => r.status === 200 || r.status === 503 
  });
}

export function authFlow() {
  // Generate random dummy data for this VU iteration
  const username = randomString(10);
  const email = `${username}@test.k6.io`;
  const password = 'Password123!';

  const payload = JSON.stringify({
    username: username,
    email: email,
    password: password
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  group('Auth API Flows', () => {
    // 1. Signup
    let signupRes = http.post(`${BASE_URL}/api/v1/auth/signup`, payload, params);
    
    // We check for 201 Created or 409 Conflict (if user happened to exist, though random makes it unlikely)
    check(signupRes, { 'signup status is 201 or 409': (r) => r.status === 201 || r.status === 409 });
    
    // 2. Login
    let loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, payload, params);
    check(loginRes, { 'login status is 200': (r) => r.status === 200 });
    
    let token = '';
    let refreshToken = '';
    
    // Extract tokens if login was successful
    if (loginRes.status === 200) {
      try {
        const body = loginRes.json();
        token = body.token;
        refreshToken = body.refresh_token;
      } catch (e) {
        console.error("Failed to parse login response:", e);
      }
    }

    // 3. Get Profile (Protected Route)
    if (token) {
        const authParams = {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
        };
        let profileRes = http.get(`${BASE_URL}/api/v1/user/profile`, authParams);
        check(profileRes, { 'profile status is 200': (r) => r.status === 200 });
    }

    // 4. Refresh Token
    if (refreshToken) {
        const refreshPayload = JSON.stringify({ refresh_token: refreshToken });
        let refreshRes = http.post(`${BASE_URL}/api/v1/auth/refresh`, refreshPayload, params);
        check(refreshRes, { 'refresh status is 200': (r) => r.status === 200 });
    }

    // 5. Logout
    let logoutRes = http.post(`${BASE_URL}/api/v1/auth/logout`, null, params);
    check(logoutRes, { 'logout status is 200': (r) => r.status === 200 });
  });

  // Small sleep to ensure we don't accidentally trip the rate limiter for the auth flow
  sleep(1);
}
