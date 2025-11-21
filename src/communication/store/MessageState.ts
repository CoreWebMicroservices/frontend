import { hookstate, useHookstate } from "@hookstate/core";
import { devtools } from "@hookstate/devtools";
import CoreMsApi from "@/common/utils/api/CoreMsApi";
import { COMMUNICATION_MS_BASE_URL } from "@/communication/config";
import { HttpMethod, PageResponse } from "@/common/model/CoreMsApiModel";
import { Message } from "@/communication/model/Message";
import { DataTableQueryParams } from "@/common/component/dataTable/DataTableTypes";
import {
  initialDataTableQueryParams,
  buildUrlSearchParams,
  createDataTableActions,
} from "@/common/component/dataTable/DataTableState";

const communicationMsApi = new CoreMsApi({
  baseURL: COMMUNICATION_MS_BASE_URL,
});

type MessagesPagedResponse = PageResponse<Message>;

interface MessageState {
  messages: Message[];
  pagedResponse?: MessagesPagedResponse;
  isInProgress: boolean;
  queryParams: DataTableQueryParams;
}

const initialState: MessageState = {
  messages: [],
  pagedResponse: undefined,
  isInProgress: false,
  queryParams: initialDataTableQueryParams,
};

const messageState = hookstate(initialState, devtools({ key: "messageState" }));

export const useMessagesState = () => {
  const state = useHookstate(messageState);
  const actions = createDataTableActions(state.queryParams);

  const fetchMessages = async () => {
    state.isInProgress.set(true);
    const params = state.queryParams.get();
    const queryParams = buildUrlSearchParams(params);

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
    ...actions,
  };
};
