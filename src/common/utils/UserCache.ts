import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { USER_MS_BASE_URL } from "@/user/config";
import type { User } from "@/user/model/User";
import { HttpMethod } from "@/common/model/CoreMsApiModel";

// Simple in-memory cache for users keyed by userId
const userCache = new Map<string, User>();

// Hard limit on bulk fetch size to avoid very long queries
const BULK_FETCH_LIMIT = 25;

const api = new CoreMsApi({ baseURL: USER_MS_BASE_URL });

async function fetchUsersByIds(ids: string[]): Promise<User[]> {
  if (ids.length === 0) return [];
  const limited = ids.slice(0, BULK_FETCH_LIMIT);
  // Backend list endpoint supports filters in format: userId:in:id1,id2
  const filterParam = encodeURIComponent(`userId:in:${limited.join(",")}`);
  const url = `/api/users?filters=${filterParam}&page=0&pageSize=${limited.length}`;
  const res = await api.apiRequest<{ items: User[] }>(HttpMethod.GET, url);
  if (res.result && res.response?.items) {
    return res.response.items;
  }
  return [];
}

export async function resolveUserNames(
  userIds: string[]
): Promise<Record<string, string>> {
  // Determine which IDs are missing from cache
  const missing = userIds.filter((id) => !!id && !userCache.has(id));
  if (missing.length > 0) {
    const fetched = await fetchUsersByIds(missing);
    fetched.forEach((u) => userCache.set(u.userId, u));
  }
  const result: Record<string, string> = {};
  userIds.forEach((id) => {
    const user = userCache.get(id);
    if (user) {
      result[id] = `${user.firstName} ${user.lastName}`.trim();
    }
  });
  return result;
}

export function getCachedUser(userId: string): User | undefined {
  return userCache.get(userId);
}

export function clearUserCache() {
  userCache.clear();
}

export default {
  resolveUserNames,
  getCachedUser,
  clearUserCache,
};
