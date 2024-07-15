import { axiosInstance } from "@/http";

export const storePat = async (data) => {
  const response = await axiosInstance.post("/pat", data);
  return response;
};
