import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import { User } from "@/user/model/User";
import CoreMsApi from "@/common/utils/CoreMsApi";
import { USER_API_BASE_URL } from "@/user/config";
import { HttpMethod } from "@/common/model/CoreMsApiModel";

const userMsApi = new CoreMsApi({ baseURL: USER_API_BASE_URL });

interface UserState {
  user?: User;
  isInProgress: boolean;
}

const initialState: UserState = {
  user: undefined,
  isInProgress: false,
};

const userState = hookstate(initialState, devtools({ key: "user" }));

export function useUserState() {
  return useHookstate(userState);
}

export async function getUserInfo(): Promise<User | undefined> {
  const user = userState.user.get();
  if (user) return user as User;

  const isInProgress = userState.isInProgress.get();
  if (isInProgress) return undefined;

  userState.isInProgress.set(true);
  try {
    const res = await userMsApi.apiRequest<User>(
      HttpMethod.GET,
      "/api/user/me"
    );
    userState.isInProgress.set(false);
    if (res.result === true && res.response) {
      userState.user.set(res.response);
      return res.response;
    }
  } catch (error) {
    userState.isInProgress.set(false);
    console.error("Failed to fetch user info", error);
  }
  return undefined;
}

export async function updateUserInfo(
  userData: Partial<User>
): Promise<User | undefined> {
  userState.isInProgress.set(true);
  try {
    const res = await userMsApi.apiRequest<User>(
      HttpMethod.PUT,
      "/api/user/me",
      userData
    );
    userState.isInProgress.set(false);
    if (res.result === true && res.response) {
      userState.user.set(res.response);
      return res.response;
    }
  } catch (error) {
    userState.isInProgress.set(false);
    console.error("Failed to update user info", error);
  }
  return undefined;
}
