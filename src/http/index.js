import axios from "axios";
import { getSession, signOut } from "next-auth/react";
import Router from "next/router";

const baseURL = "/api";

export const axiosInstance = axios.create({
  baseURL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session && session.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      signOut();
      Router.push("/login");
    }
    return Promise.reject(error);
  }
);
