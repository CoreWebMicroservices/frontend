import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import { User } from "@/user/model/User";
import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { USER_MS_BASE_URL } from "@/user/config";
import {
  ApiSuccessfulResponse,
  CoreMsApiResonse,
  HttpMethod,
} from "@/common/model/CoreMsApiModel";

const userMsApi = new CoreMsApi({ baseURL: USER_MS_BASE_URL });

interface ProfileState {
  user?: User;
  isInProgress: boolean;
}

const initialState: ProfileState = {
  user: undefined,
  isInProgress: false,
};

const profileState = hookstate(initialState, devtools({ key: "profile" }));

export function useProfileState() {
  return useHookstate(profileState);
}

export async function getProfileInfo(): Promise<CoreMsApiResonse<User>> {
  const user = profileState.user.get();
  if (user) {
    return {
      result: true,
      response: user as User,
      errors: [],
    };
  }

  const isInProgress = profileState.isInProgress.get();
  if (isInProgress) {
    return {
      result: false,
      response: {} as User,
      errors: [
        {
          reasonCode: "request.in.progress",
          description: "Request already in progress",
        },
      ],
    };
  }

  profileState.isInProgress.set(true);
  const res = await userMsApi.apiRequest<User>(HttpMethod.GET, "/api/profile");
  profileState.isInProgress.set(false);

  if (res.result === true && res.response) {
    profileState.user.set(res.response);
  }
  return res;
}

export async function updateProfileInfo(
  userData: Partial<User>
): Promise<CoreMsApiResonse<User>> {
  const cleanedData = { ...userData };
  
  if (cleanedData.phoneNumber === "") {
    delete cleanedData.phoneNumber;
  }

  profileState.isInProgress.set(true);
  const res = await userMsApi.apiRequest<User>(
    HttpMethod.PATCH,
    "/api/profile",
    cleanedData
  );
  profileState.isInProgress.set(false);

  if (res.result === true && res.response) {
    profileState.user.set(res.response);
  }
  return res;
}

export async function updateProfilePassword(passwordData: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  profileState.isInProgress.set(true);

  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    "/api/profile/change-password",
    passwordData
  );
  profileState.isInProgress.set(false);
  return res;
}
