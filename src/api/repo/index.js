import { axiosInstance } from "@/http";

export const GetRepos = async (data) => {
  return await axiosInstance.post("/run", data);
};
