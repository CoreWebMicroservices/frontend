
import { useForm } from 'react-hook-form';
import { Modal, Button, Form } from 'react-bootstrap';
import { Lock } from 'react-bootstrap-icons';
import { updateProfilePassword } from '@/user/store/ProfileState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/utils/api/ApiResponseAlertComponent';

interface ChangePasswordFormValues {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  show: boolean;
  onHide: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ show, onHide }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ChangePasswordFormValues>();

  const newPassword = watch('newPassword');
  const { success: updateSuccess, initialErrorMessage: updateInitialError, errors: updateErrors, handleResponse, clearAll } = useMessageState();

  const onSubmit = async (data: ChangePasswordFormValues) => {
    clearAll();

    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      // Handle validation error using the hook
      handleResponse(
        {
          result: false,
          response: null,
          errors: [{ reasonCode: 'validation.error', description: 'New passwords do not match' }]
        },
        'Password validation failed'
      );
      return;
    }

    const result = await updateProfilePassword({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    });

    handleResponse(
      result,
      'Failed to change password.',
      'Your password has been changed successfully.'
    );

    if (result.result) {
      reset();
      setTimeout(() => {
        clearAll();
        onHide();
      }, 2000);
    }
  };

  const handleClose = () => {
    reset();
    clearAll();
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <Lock className="me-2" />
          Change Password
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <AlertMessage success={updateSuccess} initialErrorMessage={updateInitialError} errors={updateErrors} />

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="currentPassword">
            <Form.Label>Current Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your current password"
              isInvalid={!!errors.oldPassword}
              {...register('oldPassword', {
                required: 'Current password is required'
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.oldPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="newPassword">
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

          <Form.Group className="mb-3" controlId="confirmPassword">
            <Form.Label>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              isInvalid={!!errors.confirmPassword}
              {...register('confirmPassword', {
                required: 'Please confirm your new password',
                validate: value =>
                  value === newPassword || 'Passwords do not match'
              })}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Changing...' : 'Change Password'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChangePasswordModal;