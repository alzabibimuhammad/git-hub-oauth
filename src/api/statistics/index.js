import { axiosInstance } from "@/http";

export const GetStatitics = (repo, username) => {
  return axiosInstance.post(`/statistics/${repo}`, { username });
};
