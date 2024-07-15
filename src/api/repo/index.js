import { axiosInstance } from "@/http";

export const GetRepos = async () => {
  const response = await axiosInstance.get("/repo/update_repo");
  return response;
};
