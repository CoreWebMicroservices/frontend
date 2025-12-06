import { useEffect, useState } from "react";
import { Container, Button, Badge } from "react-bootstrap";
import { useHookstate } from "@hookstate/core";
import { useTranslation } from "react-i18next";
import { Download, InfoCircle, Trash, Upload } from "react-bootstrap-icons";
import { Document, Visibility, UploadedByType } from "@/document/model/Document";
import {
  listDocuments,
  deleteDocument,
  getDocumentDownloadUrl,
} from "@/document/store/DocumentState";
import { useMessageState } from "@/common/utils/api/ApiResponseHandler";
import { AlertMessage } from "@/common/component/ApiResponseAlert";
import { DataTable } from "@/common/component/dataTable";
import type { DataTableColumn, DataTableFilter } from "@/common/component/dataTable";
import { PageResponse } from "@/common/model/CoreMsApiModel";
import {
  parseCurrentSort,
  getInitialDataTableQueryParams,
  createDataTableActions,
} from "@/common/component/dataTable/DataTableState";
import { formatDate } from "@/common/utils/DateUtils";
import DocumentUploadModal from "@/document/component/DocumentUploadModal";
import DocumentDetailsModal from "@/document/component/DocumentDetailsModal";
import { searchUsers, resolveUserNames } from "@/user/utils/UserApi";
import type { User } from "@/user/model/User";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "@/app/router/routes";
import { hasAnyRole } from "@/user/store/AuthState";
import { AppRoles } from "@/common/AppRoles";

interface DocumentListProps {
  userId?: string;
}

const DocumentList: React.FC<DocumentListProps> = ({ userId }) => {
  const { t } = useTranslation();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pagedResponse, setPagedResponse] = useState<
    PageResponse<Document> | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null
  );
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [isResolvingNames, setIsResolvingNames] = useState(false);

  const queryParams = useHookstate(() => {
    const initial = getInitialDataTableQueryParams();
    // Set userId filter on initialization if provided
    if (userId) {
      initial.filters = { userId };
    }
    return initial;
  });
  
  const { setSearch, setPage, setPageSize, setFilter, setSort } =
    createDataTableActions(queryParams);

  const { initialErrorMessage, errors, handleResponse } = useMessageState();

  const refreshDocuments = async () => {
    setIsLoading(true);
    const params = queryParams.get();
    const includeDeleted = params.filters?.includeDeleted === "true";
    const result = await listDocuments(params, includeDeleted);

    if (result.result && result.response) {
      setDocuments(result.response.items || []);
      setPagedResponse(result.response);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    refreshDocuments();
  }, [JSON.stringify(queryParams.get())]);

  async function handleDelete(uuid: string, permanent: boolean = false) {
    if (
      !confirm(
        `Are you sure you want to ${permanent ? "permanently " : ""}delete this document?`
      )
    ) {
      return;
    }

    const result = await deleteDocument(uuid, permanent);
    handleResponse(
      result,
      "Failed to delete document",
      "Document deleted successfully"
    );

    if (result.result) {
      refreshDocuments();
    }
  }

  async function handleDownload(uuid: string, filename?: string) {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const url = getDocumentDownloadUrl(uuid);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download document");
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Use provided filename or fall back to uuid
      const downloadFilename = filename || uuid;

      // Create temporary link and trigger download
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download error:", error);
      handleResponse(
        { result: false, response: null, errors: [{ reasonCode: "download.failed", description: "Failed to download document" }] },
        "Failed to download document"
      );
    }
  }

  function getVisibilityBadge(visibility: Visibility) {
    const variants = {
      [Visibility.PUBLIC]: "success",
      [Visibility.PRIVATE]: "secondary",
      [Visibility.BY_LINK]: "info",
    };
    return <Badge bg={variants[visibility]}>{visibility}</Badge>;
  }

  const columns: DataTableColumn[] = [
    { key: "owner", title: t("document.owner", "Owner") },
    { key: "name", title: t("document.name", "Name"), sortable: true },
    { key: "tags", title: t("document.tags", "Tags") },
    { key: "visibility", title: t("document.visibility", "Visibility") },
    {
      key: "createdAt",
      title: t("document.created", "Created"),
      sortable: true,
    },
    { key: "actions", title: t("common.actions", "Actions") },
  ];

  const currentSort = parseCurrentSort(queryParams.sort.get());

  const filters: DataTableFilter<User>[] = [];

  // Add user filter if not already filtered by userId prop
  if (!userId) {
    filters.push({
      key: "userId",
      label: t("document.user", "User"),
      type: "async-select",
      placeholder: t("document.filterByUser", "Filter by user"),
      loadOptions: searchUsers,
      getOptionLabel: (user: User) => `${user.firstName} ${user.lastName}`,
      getOptionValue: (user: User) => user.userId,
      getOptionSubtitle: (user: User) => user.email,
    });
  }

  filters.push({
    key: "visibility",
    label: t("document.visibility", "Visibility"),
    type: "select",
    operator: "eq",
    placeholder: t("document.allVisibilities", "All Visibilities"),
    options: [
      { value: Visibility.PUBLIC, label: "Public" },
      { value: Visibility.PRIVATE, label: "Private" },
      { value: Visibility.BY_LINK, label: "By Link" },
    ],
  });

  const renderDocumentRow = (doc: Document) => (
    <tr key={doc.uuid} style={{ opacity: doc.deleted ? 0.6 : 1 }}>
      <td>
        {doc.userId ? (
          isResolvingNames && !userNames[doc.userId] ? (
            t("common.loading", "Loading...")
          ) : (
            <Link to={APP_ROUTES.USER_EDIT.replace(":userId", doc.userId)}>
              {userNames[doc.userId] || doc.userId}
            </Link>
          )
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td>
        {doc.name}
        {doc.deleted && (
          <Badge bg="danger" className="ms-2">
            {t("document.deleted", "Deleted")}
          </Badge>
        )}
      </td>
      <td>
        {doc.tags ? (
          doc.tags.split(",").map((tag) => (
            <Badge key={tag} bg="secondary" className="me-1">
              {tag.trim()}
            </Badge>
          ))
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td>{getVisibilityBadge(doc.visibility)}</td>
      <td>{formatDate(doc.createdAt)}</td>
      <td>
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => handleDownload(doc.uuid, doc.name)}
          className="me-2"
        >
          <Download className="me-1" />
          {t("document.download", "Download")}
        </Button>
        <Button
          size="sm"
          variant="outline-info"
          onClick={() => setSelectedDocument(doc)}
          className="me-2"
        >
          <InfoCircle className="me-1" />
          {t("document.details", "Details")}
        </Button>
        {hasAnyRole([AppRoles.DocumentMsAdmin]) && (
          <Button
            size="sm"
            variant="outline-danger"
            onClick={() => handleDelete(doc.uuid, doc.deleted)}
          >
            <Trash className="me-1" />
            {doc.deleted
              ? t("document.deletePermanently", "Delete Permanently")
              : t("common.delete", "Delete")}
          </Button>
        )}
      </td>
    </tr>
  );

  const actions = (
    <button
      className="btn btn-outline-primary d-flex align-items-center"
      onClick={() => setShowUploadModal(true)}
    >
      <Upload className="me-2" />
      {t("document.uploadDocument", "Upload Document")}
    </button>
  );

  return (
    <Container>
      <AlertMessage initialErrorMessage={initialErrorMessage} errors={errors} />

      <DataTable
        items={documents}
        pagination={
          pagedResponse
            ? {
                page: pagedResponse.page,
                pageSize: pagedResponse.pageSize,
                totalElements: pagedResponse.totalElements,
                totalPages: pagedResponse.totalPages,
              }
            : undefined
        }
        isLoading={isLoading}
        columns={columns}
        filters={filters}
        filterValues={queryParams.filters.get() || {}}
        sortableFields={columns.filter((col) => col.sortable).map((col) => col.key)}
        currentSort={currentSort}
        searchPlaceholder={t(
          "document.searchPlaceholder",
          "Search documents..."
        )}
        onSearch={setSearch}
        onFilter={setFilter}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSort={setSort}
        renderRow={renderDocumentRow}
        title=""
        actions={actions}
      />

      <NameResolutionEffect
        documents={documents}
        setUserNames={setUserNames}
        setIsResolving={setIsResolvingNames}
      />

      <DocumentUploadModal
        show={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUploaded={() => {
          setShowUploadModal(false);
          refreshDocuments();
        }}
        ownerUserId={userId}
      />

      <DocumentDetailsModal
        document={selectedDocument}
        show={!!selectedDocument}
        onClose={() => setSelectedDocument(null)}
        onUpdated={refreshDocuments}
      />
    </Container>
  );
};

// Side-effect component for resolving user names with loading state
const NameResolutionEffect: React.FC<{
  documents: Document[];
  setUserNames: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setIsResolving: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ documents, setUserNames, setIsResolving }) => {
  useEffect(() => {
    const idsSet = new Set<string>();
    documents.forEach((doc) => {
      if (doc.userId) idsSet.add(doc.userId);
      if (doc.uploadedByType === UploadedByType.USER && doc.uploadedById) idsSet.add(doc.uploadedById);
    });
    const ids = Array.from(idsSet);
    if (ids.length === 0) return;
    setIsResolving(true);
    resolveUserNames(ids)
      .then((names) => {
        setUserNames((prev) => ({ ...prev, ...names }));
      })
      .finally(() => setIsResolving(false));
  }, [documents]);
  return null;
};

export default DocumentList;
