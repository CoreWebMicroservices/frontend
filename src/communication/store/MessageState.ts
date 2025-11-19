import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { COMMUNICATION_MS_BASE_URL } from "@/communication/config";
import { HttpMethod, PageResponse } from "@/common/model/CoreMsApiModel";
import { Message } from "@/communication/model/Message";
import { FilterOperator } from "@/common/component/dataTable";

const communicationMsApi = new CoreMsApi({
  baseURL: COMMUNICATION_MS_BASE_URL,
});

type MessagesPagedResponse = PageResponse<Message>;

interface MessageQueryParams {
  page: number;
  pageSize: number;
  search: string;
  sort?: string;
  filters?: Record<string, string | number | boolean>;
  filterOperators?: Record<string, FilterOperator>;
}

interface MessageState {
  messages: Message[];
  pagedResponse?: MessagesPagedResponse;
  isInProgress: boolean;
  queryParams: MessageQueryParams;
}

const initialState: MessageState = {
  messages: [],
  pagedResponse: undefined,
  isInProgress: false,
  queryParams: {
    page: 1,
    pageSize: 20,
    search: "",
    sort: undefined,
  },
};

const messageState = hookstate(initialState, devtools({ key: "messageState" }));

export const useMessagesState = () => {
  const state = useHookstate(messageState);

  const fetchMessages = async () => {
    state.isInProgress.set(true);
    const params = state.queryParams.get();

    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      pageSize: params.pageSize.toString(),
    });

    if (params.sort) queryParams.append("sort", params.sort);
    if (params.search) queryParams.append("search", params.search);

    if (params.filters) {
      Object.entries(params.filters).forEach(([key, value]) => {
        const operator = params.filterOperators?.[key];
        const filterValue = operator
          ? `${key}:${operator}:${value.toString()}`
          : `${key}:${value.toString()}`;
        queryParams.append("filter", filterValue);
      });
    }

    const response = await communicationMsApi.apiRequest<MessagesPagedResponse>(
      HttpMethod.GET,
      `/api/messages?${queryParams.toString()}`
    );

    if (response.result && response.response) {
      state.pagedResponse.set(response.response);
      state.messages.set(response.response.items);
    }

    state.isInProgress.set(false);
    return response;
  };

  return {
    state,
    fetchMessages,
    setPage: (page: number) => state.queryParams.page.set(page),
    setPageSize: (size: number) => state.queryParams.pageSize.set(size),
    setSearch: (search: string) => state.queryParams.search.set(search),
    setSort: (field: string, direction: "asc" | "desc") =>
      state.queryParams.sort.set(`${field}:${direction}`),
    setFilters: (filters: Record<string, string | number | boolean>) =>
      state.queryParams.filters.set(filters),
  };
};
