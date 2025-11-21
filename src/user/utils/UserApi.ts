import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { USER_MS_BASE_URL } from "@/user/config";
import { HttpMethod, PageResponse } from "@/common/model/CoreMsApiModel";
import { User } from "@/user/model/User";

const userMsApi = new CoreMsApi({ baseURL: USER_MS_BASE_URL });

export const searchUsers = async (search: string): Promise<User[]> => {
  try {
    const params = new URLSearchParams({
      page: "1",
      pageSize: "10",
      search: search,
    });

    const res = await userMsApi.apiRequest<PageResponse<User>>(
      HttpMethod.GET,
      `/api/users?${params.toString()}`
    );

    if (res.result && res.response) {
      return res.response.items;
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch users", error);
    return [];
  }
};
