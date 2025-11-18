const BASE_URL = "http://localhost:8080";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

const refreshInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const status = error?.response?.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login.html";
        return Promise.reject(error);
      }

      try {
        const reissueResponse = await refreshInstance.post(
          "/reissue",
          {},
          { headers: { "Authorization-Refresh": refreshToken } }
        );

        const newAccessToken = reissueResponse.headers[
          "authorization"
        ]?.replace("Bearer ", "");

        const newRefreshToken =
          reissueResponse.headers["authorization-refresh"];

        if (newAccessToken) localStorage.setItem("accessToken", newAccessToken);

        if (newRefreshToken)
          localStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (reissueError) {
        console.error("토큰 재발급 실패", reissueError);

        alert("세션 만료. 재로그인 필요.");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.location.href = "/login.html";
        return Promise.reject(reissueError);
      }
    }
    return Promise.reject(error);
  }
);
