let accessToken: string | null = null;

export const tokenManager = {
  get: () => {
    return accessToken || localStorage.getItem("mill_access_token");
  },

  set: (token: string | null) => {
    accessToken = token;
    if (token) {
      localStorage.setItem("mill_access_token", token);
    } else {
      localStorage.removeItem("mill_access_token");
    }
  },

  clear: () => {
    accessToken = null;
    localStorage.removeItem("mill_access_token");
  },
};