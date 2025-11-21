import React, { useEffect } from "react";
import { Badge, OverlayTrigger, Popover } from "react-bootstrap";
import { Envelope, ChatDots, CheckCircle, XCircle, Clock, Eye } from "react-bootstrap-icons";
import { useHookstate } from "@hookstate/core";
import { DataTable, DataTableFilter } from "@/common/component/dataTable";
import { useMessagesState } from "@/communication/store/MessageState";
import { Message, EmailPayload } from "@/communication/model/Message";
import { useMessageState } from "@/common/utils/api/ApiResponseHandler";
import { AlertMessage } from "@/common/component/ApiResponseAlert";
import { searchUsers } from "@/user/utils/UserApi";
import { User } from "@/user/model/User";
import { parseCurrentSort, getInitialDataTableQueryParams, createDataTableActions } from "@/common/component/dataTable/DataTableState";
import { formatDate } from "@/common/utils/DateUtils";
import { getRecipient, getContentPreview, getFullContent } from "@/communication/utils/MessageUtils";

export const MessageList: React.FC = () => {
  const { fetchMessages } = useMessagesState();
  const { initialErrorMessage, errors } = useMessageState();
  const [isLoading, setIsLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [pagedResponse, setPagedResponse] = React.useState<any>(undefined);

  // Local state for query params
  const queryParams = useHookstate(getInitialDataTableQueryParams());
  const {
    setSearch,
    setPage,
    setPageSize,
    setFilter,
    setSort
  } = createDataTableActions(queryParams);

  useEffect(() => {
    setIsLoading(true);
    fetchMessages(queryParams.get()).then((res) => {
      if (res.result && res.response) {
        setMessages(res.response.items);
        setPagedResponse(res.response);
      }
    }).finally(() => setIsLoading(false));
  }, [JSON.stringify(queryParams.get())]);

  const filters: DataTableFilter<User>[] = [
    {
      key: 'userId',
      label: 'User',
      type: 'async-select',
      placeholder: 'Filter by User',
      loadOptions: searchUsers,
      getOptionLabel: (user: User) => `${user.firstName} ${user.lastName}`,
      getOptionValue: (user: User) => user.userId,
      getOptionSubtitle: (user: User) => user.email
    }
  ];

  const columns = [
    { key: "type", title: "Channel", sortable: false, width: "100px" },
    { key: "createdAt", title: "Sent", sortable: true, width: "180px" },
    { key: "recipient", title: "To", sortable: false },
    { key: "content", title: "Content", sortable: false },
    { key: "status", title: "Status", sortable: true, width: "80px" },
  ];

  const renderStatus = (status: string) => {
    switch (status) {
      case 'sent':
        return <Badge bg="success" className="d-flex align-items-center gap-1"><CheckCircle /> Sent</Badge>;
      case 'failed':
        return <Badge bg="danger" className="d-flex align-items-center gap-1"><XCircle /> Failed</Badge>;
      case 'enqueued':
        return <Badge bg="primary" className="d-flex align-items-center gap-1"><Clock /> Queued</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const renderRow = (msg: Message) => {
    const content = getFullContent(msg);
    const preview = getContentPreview(msg);
    const isHtml = msg.type === 'email' && (msg.payload as EmailPayload).emailType === 'html';

    const popover = (
      <Popover id={`popover-${msg.uuid}`} style={{ maxWidth: '500px' }}>
        <Popover.Header as="h3">
          {msg.type === 'email' ? 'Email Content' : 'SMS Content'}
        </Popover.Header>
        <Popover.Body style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {isHtml ? (
            <div dangerouslySetInnerHTML={{ __html: content }} />
          ) : (
            <div style={{ whiteSpace: 'pre-wrap' }}>{content}</div>
          )}
        </Popover.Body>
      </Popover>
    );

    return (
      <tr key={msg.uuid}>
        <td className="align-middle">
          {msg.type === 'email' ?
            <div className="d-flex align-items-center text-info"><Envelope className="me-2" /> Email</div> :
            <div className="d-flex align-items-center text-warning"><ChatDots className="me-2" /> SMS</div>
          }
        </td>
        <td className="align-middle text-muted small">
          {msg.createdAt ? formatDate(msg.createdAt) : "-"}
        </td>
        <td className="align-middle fw-medium">{getRecipient(msg)}</td>
        <td className="align-middle">
          <div className="d-flex align-items-center" style={{ cursor: 'help' }}>
            <div className="text-truncate" style={{ maxWidth: '300px' }}>
              {msg.type === 'email' && <span className="fw-bold me-1">Subject:</span>}
              {preview}
            </div>
          </div>
        </td>
        <td className="align-middle">
          {renderStatus(msg.status)}
        </td>
        <td className="align-middle text-end">
          <OverlayTrigger
            trigger={['hover', 'focus']}
            placement="auto"
            delay={{ show: 300, hide: 100 }}
            overlay={popover}
          >
            <Eye size={18} />
          </OverlayTrigger>

        </td>
      </tr>
    );
  };

  return (
    <>
      <AlertMessage initialErrorMessage={initialErrorMessage} errors={errors} />
      <DataTable
        title="Messages"
        items={messages as unknown as Message[]}
        pagination={pagedResponse ? {
          page: pagedResponse.page,
          pageSize: pagedResponse.pageSize,
          totalElements: pagedResponse.totalElements,
          totalPages: pagedResponse.totalPages
        } : undefined}
        isLoading={isLoading}
        columns={columns}
        filters={filters}
        filterValues={queryParams.filters.get() || {}}
        onFilter={setFilter}
        sortableFields={columns.filter(col => col.sortable).map(col => col.key)}
        currentSort={parseCurrentSort(queryParams.sort.get())}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        onSort={(field, direction) => setSort(field, direction)}
        renderRow={renderRow}
      />
    </>
  );
};
