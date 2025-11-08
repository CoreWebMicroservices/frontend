import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { Key, X } from 'react-bootstrap-icons';
import { adminChangeUserPassword } from '@/user/store/UserState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/utils/api/ApiResponseAlertComponent';

interface AdminChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
  userId: string;
  userName: string;
}

interface PasswordFormValues {
  newPassword: string;
  confirmPassword: string;
}

const AdminChangePasswordModal = ({ show, onHide, userId, userName }: AdminChangePasswordModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<PasswordFormValues>();
  const { success, initialErrorMessage, errors: apiErrors, handleResponse, clearAll } = useMessageState();

  const newPassword = watch('newPassword');

  const handleClose = () => {
    reset();
    clearAll();
    onHide();
  };

  const onSubmit = async (data: PasswordFormValues) => {
    setIsSubmitting(true);

    const passwordRequest = {
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    const result = await adminChangeUserPassword(userId, passwordRequest);

    handleResponse(
      result,
      `Password has been changed successfully for ${userName}.`,
      `Failed to change password for ${userName}.`
    );

    setIsSubmitting(false);

    if (result.result) {
      // Close modal on success
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Key className="me-2" />
          Change Password - {userName}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <AlertMessage success={success} initialErrorMessage={initialErrorMessage} errors={apiErrors} />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              isInvalid={!!errors.newPassword}
              {...register('newPassword', {
                required: 'New password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters long'
                }
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              isInvalid={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm the new password',
                validate: (value) =>
                  value === newPassword || 'Passwords do not match'
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="outline-secondary" onClick={handleClose} disabled={isSubmitting}>
              <X className="me-1" />
              Cancel
            </Button>
            <Button
              variant="warning"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Changing...
                </>
              ) : (
                <>
                  <Key className="me-1" />
                  Change Password
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminChangePasswordModal;