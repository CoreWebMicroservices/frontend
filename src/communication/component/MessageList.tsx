import React, { useEffect } from "react";
import { Badge, Button, OverlayTrigger, Popover } from "react-bootstrap";
import { Envelope, ChatDots, CheckCircle, XCircle, Clock, Eye } from "react-bootstrap-icons";
import { DataTable } from "@/common/component/dataTable";
import { useMessagesState } from "@/communication/store/MessageState";
import { Message, SmsPayload, EmailPayload } from "@/communication/model/Message";
import { useMessageState } from "@/common/utils/api/ApiResponseHandler";
import { AlertMessage } from "@/common/component/ApiResponseAlert";

export const MessageList: React.FC = () => {
  const { state, fetchMessages, setPage, setPageSize, setSearch, setSort } = useMessagesState();
  const { initialErrorMessage, errors } = useMessageState();

  const messages = state.messages.get();
  const pagedResponse = state.pagedResponse.get();
  const isInProgress = state.isInProgress.get();
  const queryParams = state.queryParams.get();

  useEffect(() => {
    fetchMessages();
  }, [queryParams.page, queryParams.pageSize, queryParams.sort, queryParams.search, queryParams.filters]);

  const columns = [
    { key: "type", title: "Channel", sortable: true, width: "100px" },
    { key: "createdAt", title: "Sent", sortable: true, width: "180px" },
    { key: "recipient", title: "To", sortable: false },
    { key: "content", title: "Content", sortable: false },
    { key: "status", title: "Status", sortable: true, width: "120px" },
  ];

  const getRecipient = (msg: Message) => {
    if (msg.type === 'sms') {
      return (msg.payload as SmsPayload).phoneNumber;
    } else if (msg.type === 'email') {
      return (msg.payload as EmailPayload).recipient;
    }
    return msg.userId;
  };

  const getContentPreview = (msg: Message) => {
    if (msg.type === 'sms') {
      return (msg.payload as SmsPayload).message;
    } else if (msg.type === 'email') {
      return (msg.payload as EmailPayload).subject;
    }
    return '';
  };

  const getFullContent = (msg: Message) => {
    if (msg.type === 'sms') {
      return (msg.payload as SmsPayload).message;
    } else if (msg.type === 'email') {
      return (msg.payload as EmailPayload).body;
    }
    return '';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const parseCurrentSort = (sort?: string) => {
    if (!sort) return undefined;
    const [field, direction] = sort.split(':');
    return { field, direction: direction as 'asc' | 'desc' };
  };

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
        <Popover.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
        <td className="align-middle text-muted small">
          {msg.createdAt ? formatDate(msg.createdAt) : "-"}
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
        isLoading={isInProgress}
        columns={columns}
        sortableFields={columns.filter(col => col.sortable).map(col => col.key)}
        currentSort={parseCurrentSort(queryParams.sort)}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSearch={setSearch}
        onSort={(field, direction) => setSort(field, direction)}
        renderRow={renderRow}
      />
    </>
  );
};
