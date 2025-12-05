import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ModalDialog } from "@/common/component/ModalDialog";
import { uploadDocumentMultipart } from "@/document/store/DocumentState";
import { Visibility } from "@/document/model/Document";
import { useMessageState } from "@/common/utils/api/ApiResponseHandler";
import { AlertMessage } from "@/common/component/ApiResponseAlert";

interface DocumentUploadModalProps {
  show: boolean;
  onClose: () => void;
  onUploaded?: () => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  show,
  onClose,
  onUploaded,
}) => {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.PRIVATE);
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [confirmReplace, setConfirmReplace] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initialErrorMessage, errors, success, handleResponse } = useMessageState();

  async function handleSubmit() {
    if (!file) {
      return;
    }

    setIsSubmitting(true);

    const metadata = {
      visibility,
      description: description || undefined,
      tags: tags ? tags.split(",").map((t) => t.trim()) : undefined,
      confirmReplace,
    };

    const result = await uploadDocumentMultipart(file, metadata);
    setIsSubmitting(false);

    handleResponse(
      result,
      t("document.uploadFailed", "Failed to upload document"),
      t("document.uploadSuccess", "Document uploaded successfully")
    );

    if (result.result) {
      if (onUploaded) onUploaded();
      // Clear form
      setFile(null);
      setDescription("");
      setTags("");
      setConfirmReplace(false);
      setVisibility(Visibility.PRIVATE);
    }
  }

  return (
    <ModalDialog
      title={t("document.uploadDocument", "Upload Document")}
      show={show}
      onClose={onClose}
      onPrimary={handleSubmit}
      primaryText={
        isSubmitting
          ? t("document.uploading", "Uploading...")
          : t("document.upload", "Upload")
      }
      disabledPrimary={isSubmitting || !file}
      size="lg"
      footerContent={
        success && <span className="text-success me-auto">{success}</span>
      }
    >
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>{t("document.file", "File")} *</Form.Label>
          <Form.Control
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFile(e.target.files?.[0] || null)
            }
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("document.visibility", "Visibility")}</Form.Label>
          <Form.Select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as Visibility)}
          >
            <option value={Visibility.PRIVATE}>
              {t("document.private", "Private")}
            </option>
            <option value={Visibility.PUBLIC}>
              {t("document.public", "Public")}
            </option>
            <option value={Visibility.BY_LINK}>
              {t("document.byLink", "By Link")}
            </option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("document.description", "Description")} (
            {t("common.optional", "Optional")})
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            {t("document.tags", "Tags")} (
            {t("common.optional", "Optional, comma-separated")})
          </Form.Label>
          <Form.Control
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tag1, tag2, tag3"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label={t("document.confirmReplace", "Replace existing document with same name/checksum")}
            checked={confirmReplace}
            onChange={(e) => setConfirmReplace(e.target.checked)}
          />
        </Form.Group>

        <AlertMessage
          initialErrorMessage={initialErrorMessage}
          errors={errors}
        />
      </Form>
    </ModalDialog>
  );
};

export default DocumentUploadModal;
