import { useState } from "react";
import { Card, Button, Badge, Form, InputGroup, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Download, Link45deg } from "react-bootstrap-icons";
import { Document, Visibility } from "@/document/model/Document";
import { generateDocumentAccessLink, getDocumentDownloadUrl } from "@/document/store/DocumentState";
import { useMessageState } from "@/common/utils/api/ApiResponseHandler";
import { formatDate } from "@/common/utils/DateUtils";

interface DocumentDetailsProps {
  document: Document;
}

export function DocumentDetails({ document }: DocumentDetailsProps) {
  const { t } = useTranslation();
  const [linkExpiry, setLinkExpiry] = useState(3600);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleResponse } = useMessageState();

  async function handleGenerateLink() {
    setLoading(true);
    
    const result = await generateDocumentAccessLink(document.uuid, {
      expiresInSeconds: linkExpiry,
    });
    setLoading(false);

    if (result.result && result.response) {
      setGeneratedLink(result.response.url);
      handleResponse(
        result,
        t("document.linkFailed", "Failed to generate access link"),
        t("document.linkGenerated", "Access link generated successfully")
      );
    } else {
      handleResponse(result, t("document.linkFailed", "Failed to generate access link"));
    }
  }

  function handleDownload() {
    window.open(getDocumentDownloadUrl(document.uuid), "_blank");
  }

  function getVisibilityBadge(visibility: Visibility) {
    const variants = {
      [Visibility.PUBLIC]: "success",
      [Visibility.PRIVATE]: "secondary",
      [Visibility.BY_LINK]: "info",
    };
    return <Badge bg={variants[visibility]}>{visibility}</Badge>;
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  return (
    <Card>
      <Card.Header>
        <h5>{document.name}</h5>
      </Card.Header>
      <Card.Body>
        <p><strong>{t("document.originalFilename", "Original Filename")}:</strong> {document.originalFilename}</p>
        <p><strong>{t("document.size", "Size")}:</strong> {formatFileSize(document.size)}</p>
        <p><strong>{t("document.type", "Type")}:</strong> {document.contentType}</p>
        <p><strong>{t("document.extension", "Extension")}:</strong> {document.extension}</p>
        <p><strong>{t("document.visibility", "Visibility")}:</strong> {getVisibilityBadge(document.visibility)}</p>
        <p><strong>{t("document.created", "Created")}:</strong> {formatDate(document.createdAt)}</p>
        <p><strong>{t("document.updated", "Updated")}:</strong> {formatDate(document.updatedAt)}</p>
        
        {document.description && (
          <p><strong>{t("document.description", "Description")}:</strong> {document.description}</p>
        )}
        
        {document.tags && (
          <p>
            <strong>{t("document.tags", "Tags")}:</strong>{" "}
            {document.tags.split(",").map((tag) => (
              <Badge key={tag} bg="secondary" className="me-1">
                {tag.trim()}
              </Badge>
            ))}
          </p>
        )}

        <Button variant="primary" onClick={handleDownload} className="me-2">
          <Download className="me-2" />
          {t("document.download", "Download")}
        </Button>

        {document.visibility === Visibility.BY_LINK && (
          <div className="mt-3">
            <h6>{t("document.generateLink", "Generate Access Link")}</h6>
            <InputGroup className="mb-2">
              <Form.Control
                type="number"
                value={linkExpiry}
                onChange={(e) => setLinkExpiry(Number(e.target.value))}
                placeholder={t("document.expirySeconds", "Expiry in seconds")}
              />
              <Button onClick={handleGenerateLink} disabled={loading}>
                {loading ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <>
                    <Link45deg className="me-1" />
                    {t("document.generate", "Generate")}
                  </>
                )}
              </Button>
            </InputGroup>
            
            {generatedLink && (
              <Form.Control
                type="text"
                value={generatedLink}
                readOnly
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
            )}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
