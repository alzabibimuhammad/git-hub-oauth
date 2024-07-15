import { axiosInstance } from "@/http";

export const GetStatitics = (repo) => {
  return axiosInstance.get(`/statistics/${repo}`);
};
