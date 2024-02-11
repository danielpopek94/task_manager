/* eslint-disable @typescript-eslint/no-explicit-any */
import { BASE_URL } from "../api";

function wait(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

function request<T>(
  url: string,
  method: RequestMethod = "GET",
  data: any = null
): Promise<T> {
  const options: RequestInit = { method };
  const TOKEN_AUTH = localStorage.getItem("token");

  if (data) {
    options.body = JSON.stringify(data);
  }

  options.headers = {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: `Bearer ${TOKEN_AUTH}`,
  };

  return wait(0)
    .then(() => fetch(BASE_URL + url, options))
    .then((response) => {
      if (response.status === 403) {
        localStorage.clear();
        window.location.reload();
      } else if (!response.ok) {
        throw new Error();
      }

      return response.json();
    });
}

export const client = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: any) => request<T>(url, "POST", data),
  patch: <T>(url: string, data: any) => request<T>(url, "PATCH", data),
  delete: (url: string) => request(url, "DELETE"),
};
