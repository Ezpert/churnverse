import axios from 'axios';


const API_URL = 'http://127.0.0.1:8000';


const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  (config) => {
    const storedTokens = localStorage.getItem('authTokens');
    if (storedTokens) {
      const tokens = JSON.parse(storedTokens);
      config.headers.Authorization = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      const storedTokens = localStorage.getItem('authTokens');
      if (storedTokens) {
        const tokens = JSON.parse(storedTokens);


        try {
          const response = await api.post("/api/token/refresh/", {
            "refresh": tokens.refresh
          })

          const newTokens = {
            access: response.data.access,
            refresh: tokens.refresh,
          };

          localStorage.setItem('authTokens', JSON.stringify(newTokens));

          error.config.headers['Authorization'] = `Bearer ${response.data.access}`;

          return api(error.config);

        } catch (refreshError) {
          console.error('Failed to refresh token: ', refreshError);
        }

      }

    }
    return Promise.reject(error);
  }
);




export default api;
