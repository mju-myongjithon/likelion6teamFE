import axios, { AxiosError } from "axios";

/**
 * 백엔드 API용 axios 인스턴스.
 *
 * 인증은 서버 세션 기반이다. 별도의 토큰을 헤더에 붙이지 않고,
 * `withCredentials: true` 로 브라우저가 세션 쿠키를 자동 전송한다.
 * (백엔드는 CORS 응답에 `Access-Control-Allow-Credentials: true` 와
 *  구체적인 Origin 을 내려줘야 쿠키가 실린다.)
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

/** 401(미인증/세션 만료) 응답 시 로그인 페이지로 보낼지 여부. 로그인 화면 자체에서는 리다이렉트하지 않는다. */
function shouldRedirectToLogin(status: number | undefined): boolean {
  return status === 401 && window.location.pathname !== "/login";
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;

    // 세션이 없거나 만료됨 → 로그인 화면으로 유도
    if (shouldRedirectToLogin(status)) {
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default apiClient;
