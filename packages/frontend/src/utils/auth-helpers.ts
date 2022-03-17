import Cookies from "js-cookie";

export const AUTH_TOKEN_COOKIE_KEY = "auth_token";

export function getAuthToken() {
  return Cookies.get(AUTH_TOKEN_COOKIE_KEY)!;
}

export function removeAuthTokenFromCookies() {
  // handle all possible ways browsers save cookies
  Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
    path: "/",
    domain: "." + window.location.hostname,
  });
  Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
    path: "/",
    domain: window.location.hostname,
  });
}

export function setAuthTokenAsCookie(token: string) {
  Cookies.set(AUTH_TOKEN_COOKIE_KEY, token, {
    path: "/",
    domain: window.location.hostname,
  });
}
