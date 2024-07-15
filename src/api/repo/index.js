import { axiosInstance } from "@/http";

export const GetRepos = async () => {
  const response = await axiosInstance.get("/run");
  return response;
};
