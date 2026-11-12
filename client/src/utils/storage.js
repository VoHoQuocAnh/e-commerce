// client/src/utils/storage.js
const KEYS = {
  ACCESS_TOKEN: 'calem_access_token',
  REFRESH_TOKEN: 'calem_refresh_token',
  USER: 'calem_user',
};

export const storage = {
  getAccessToken: () => localStorage.getItem(KEYS.ACCESS_TOKEN),
  setAccessToken: (token) => token && localStorage.setItem(KEYS.ACCESS_TOKEN, token),
  getRefreshToken: () => localStorage.getItem(KEYS.REFRESH_TOKEN),
  setRefreshToken: (token) => token && localStorage.setItem(KEYS.REFRESH_TOKEN, token),
  getUser: () => {
    try {
      const raw = localStorage.getItem(KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user)),
  clearAuth: () => {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
  },
};
