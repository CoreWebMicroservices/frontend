import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { USER_API_BASE_URL } from "@/user/config";
import {
  ApiSuccessfulResponse,
  CoreMsApiResonse,
  HttpMethod,
  PageResponse,
} from "@/common/model/CoreMsApiModel";
import {
  User,
  CreateUserRequest,
  AdminChangePasswordRequest,
  ChangeEmailRequest,
} from "@/user/model/User";
import { FilterOperator } from "@/common/component/dataTable";

const userMsApi = new CoreMsApi({ baseURL: USER_API_BASE_URL });

// Type alias for users paged response using generic PageResponse
type UsersPagedResponse = PageResponse<User>;

interface UserQueryParams {
  page: number;
  pageSize: number;
  search: string;
  sort?: string;
  filters?: Record<string, string | number | boolean>;
  filterOperators?: Record<string, FilterOperator>;
}

interface UserManagementState {
  users: User[];
  selectedUser?: User;
  pagedResponse?: UsersPagedResponse;
  isInProgress: boolean;
  queryParams: UserQueryParams;
}

const initialState: UserManagementState = {
  users: [],
  selectedUser: undefined,
  pagedResponse: undefined,
  isInProgress: false,
  queryParams: {
    page: 1,
    pageSize: 20,
    search: "",
    sort: undefined,
    filters: undefined,
    filterOperators: undefined,
  },
};

const userState = hookstate(initialState, devtools({ key: "userManagement" }));

export function useUserState() {
  return useHookstate(userState);
}

// Get all users with pagination - uses state parameters
export async function getAllUsers(): Promise<
  CoreMsApiResonse<UsersPagedResponse>
> {
  userState.isInProgress.set(true);

  const queryParams = userState.queryParams.get();
  const params = new URLSearchParams({
    page: queryParams.page.toString(),
    pageSize: queryParams.pageSize.toString(),
  });

  if (queryParams.sort) params.append("sort", queryParams.sort);
  if (queryParams.search) params.append("search", queryParams.search);
  if (queryParams.filters) {
    Object.entries(queryParams.filters).forEach(([key, value]) => {
      const operator = queryParams.filterOperators?.[key];
      const filterValue = operator
        ? `${key}:${operator}:${value.toString()}`
        : `${key}:${value.toString()}`;
      params.append("filter", filterValue);
    });
  }

  const res = await userMsApi.apiRequest<UsersPagedResponse>(
    HttpMethod.GET,
    `/api/users?${params.toString()}`
  );

  userState.isInProgress.set(false);

  if (res.result === true && res.response) {
    userState.pagedResponse.set(res.response);
    userState.users.set(res.response.items);
  }

  return res;
}

// Get user by ID - matches /api/users/{userId}
export async function getUserById(
  userId: string,
  isBackgroundFetch = false
): Promise<CoreMsApiResonse<User>> {
  if (!isBackgroundFetch) userState.isInProgress.set(true);

  const res = await userMsApi.apiRequest<User>(
    HttpMethod.GET,
    `/api/users/${userId}`
  );

  userState.isInProgress.set(false);

  if (res.result === true && res.response) {
    userState.selectedUser.set(res.response);
  }

  return res;
}

// Create new user - matches POST /api/users
export async function createUser(
  userData: CreateUserRequest
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  userState.isInProgress.set(true);

  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    `/api/users`,
    userData
  );

  userState.isInProgress.set(false);

  // Refresh the users list after creating
  if (res.result === true) {
    getAllUsers();
  }

  return res;
}

// Update user information  - matches PUT /api/users/{userId}
export async function updateUserInfo(
  userId: string,
  userData: User
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.PUT,
    `/api/users/${userId}`,
    userData
  );

  if (res.result === true) {
    getUserById(userId, true);
  }

  return res;
}

// Delete user  - matches DELETE /api/users/{userId}
export async function deleteUser(
  userId: string
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  userState.isInProgress.set(true);

  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.DELETE,
    `/api/users/${userId}`
  );

  userState.isInProgress.set(false);

  if (res.result === true) {
    // Remove user from the list
    const users = userState.users.get();
    const updatedUsers = users.filter((user) => user.userId !== userId);
    userState.users.set(updatedUsers);

    // Clear selected user if it was the deleted one
    const selectedUser = userState.selectedUser.get();
    if (selectedUser?.userId === userId) {
      userState.selectedUser.set(undefined);
    }
  }

  return res;
}

// Trigger password reset flow for a user (admin) - matches POST /api/users/{userId}/reset-password
export async function triggerUserPasswordReset(
  userId: string
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    `/api/users/${userId}/reset-password`
  );

  return res;
}

// Admin set/change password for a user - matches POST /api/users/{userId}/change-password
export async function adminChangeUserPassword(
  userId: string,
  passwordData: AdminChangePasswordRequest
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    `/api/users/${userId}/change-password`,
    passwordData
  );

  return res;
}

// Admin change user's email (immediate) - matches POST /api/users/{userId}/change-email
export async function adminChangeUserEmail(
  userId: string,
  emailData: ChangeEmailRequest
): Promise<CoreMsApiResonse<ApiSuccessfulResponse>> {
  const res = await userMsApi.apiRequest<ApiSuccessfulResponse>(
    HttpMethod.POST,
    `/api/users/${userId}/change-email`,
    emailData
  );

  if (res.result === true) {
    getUserById(userId, true);
  }

  return res;
}

// Update search
export function setSearch(search: string): void {
  userState.queryParams.search.set(search);
  userState.queryParams.page.set(1);
  getAllUsers();
}

// Update page
export function setPage(page: number): void {
  userState.queryParams.page.set(page);
  getAllUsers();
}

// Update page size
export function setPageSize(pageSize: number): void {
  userState.queryParams.pageSize.set(pageSize);
  userState.queryParams.page.set(1); // Reset to first page when changing page size
  getAllUsers();
}

// Handle column sorting with toggle behavior
export function setSort(field: string, direction: "asc" | "desc"): void {
  if (field === "name") field = "lastName";
  const sortValue = `${field}:${direction}`;
  userState.queryParams.sort.set(sortValue);
  getAllUsers();
}

// Update filters
export function setFilter(
  key: string,
  value: string | number | boolean | null,
  operator?: FilterOperator
): void {
  const currentFilters = userState.queryParams.filters.get() || {};
  const currentOperators = userState.queryParams.filterOperators.get() || {};

  if (value === null || value === "" || value === undefined) {
    // Remove filter if value is null/empty
    const remainingFilters = { ...currentFilters };
    delete remainingFilters[key];
    userState.queryParams.filters.set(
      Object.keys(remainingFilters).length > 0 ? remainingFilters : undefined
    );

    const remainingOperators = { ...currentOperators };
    delete remainingOperators[key];
    userState.queryParams.filterOperators.set(
      Object.keys(remainingOperators).length > 0
        ? remainingOperators
        : undefined
    );
  } else {
    // Set/update filter
    userState.queryParams.filters.set({
      ...currentFilters,
      [key]: value,
    });

    if (operator) {
      userState.queryParams.filterOperators.set({
        ...currentOperators,
        [key]: operator,
      });
    }
  }

  userState.queryParams.page.set(1); // Reset to first page when filtering
  getAllUsers();
}

// Clear all filters
export function clearFilters(): void {
  userState.queryParams.filters.set(undefined);
  userState.queryParams.filterOperators.set(undefined);
  userState.queryParams.page.set(1);
  getAllUsers();
}

// Update filters
export function setFilters(
  filters?: Record<string, string | number | boolean>
): void {
  userState.queryParams.filters.set(filters);
  // Note: This doesn't handle operators, assuming bulk set is for simple values or reset
}

// Reset query parameters to defaults
export function resetQueryParams(): void {
  userState.queryParams.set({
    page: 1,
    pageSize: 20,
    search: "",
    sort: undefined,
    filters: undefined,
    filterOperators: undefined,
  });
}

// Clear selected user
export function clearSelectedUser(): void {
  userState.selectedUser.set(undefined);
}

// Clear users list
export function clearUsersList(): void {
  userState.users.set([]);
}
