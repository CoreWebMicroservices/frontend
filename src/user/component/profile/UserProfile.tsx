import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useProfileState, getProfileInfo, updateProfileInfo } from '@/user/store/ProfileState';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import { Col, Row } from 'react-bootstrap';
import { Lock } from 'react-bootstrap-icons';
import ChangePasswordModal from './ChangePasswordModal';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/utils/api/ApiResponseAlertComponent';

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const UserProfile = () => {
  const profileState = useProfileState();
  const user = profileState.user.get();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>();
  const { success: updateSuccess, initialErrorMessage: updateInitialError, errors: updateErrors, handleResponse } = useMessageState();

  const onSubmit = async (data: UserFormValues) => {
    const result = await updateProfileInfo(data);
    handleResponse(
      result,
      'Your profile has been updated successfully.',
      'Failed to update user information.'
    );
  };

  useEffect(() => {
    getProfileInfo().then(result => {
      if (result.result && result.response) {
        reset({
          firstName: result.response.firstName,
          lastName: result.response.lastName,
          email: result.response.email,
        });
      }
    });
  }, [reset]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container>
      <Row>
        <Col>
          <h2 className="mb-4 mt-3 text-center">Profile</h2>
          {user.imageUrl ? (
            <div className="mb-3 text-center">
              <img
                src={user.imageUrl}
                alt="User avatar"
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--bs-primary)' }}
              />
            </div>
          ) : (
            <div className="mb-3 text-center">
              <label htmlFor="user-image-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
                <div style={{
                  width: 96,
                  height: 96,
                  borderRadius: '50%',
                  background: '#e9ecef',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed var(--bs-primary)',
                  fontSize: 32,
                  color: 'var(--bs-primary)'
                }}>
                  +
                </div>
                <input
                  id="user-image-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                // TODO: handle image upload
                />
              </label>
            </div>
          )}
          <Form className="mb-3" onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.firstName}
                {...register('firstName', { required: 'First name is required' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstName?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                isInvalid={!!errors.lastName}
                {...register('lastName', { required: 'Last name is required' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastName?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                isInvalid={!!errors.email}
                {...register('email', { required: 'Email is required' })}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                Save Changes
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowPasswordModal(true)}
                disabled={isSubmitting}
              >
                <Lock className="me-1" size={16} />
                Change Password
              </Button>
            </div>
          </Form>
          <AlertMessage success={updateSuccess} initialErrorMessage={updateInitialError} errors={updateErrors} />
        </Col>
        <Col md={4}>
          <h2 className="mb-4 mt-3 text-center">Roles</h2>
          <ul className="list-group">
            {user.roles?.map((role) => (
              <li key={role} className="list-group-item text-center">
                {role}
              </li>
            ))}
          </ul>
        </Col>
      </Row>

      {/* Change Password Modal */}
      <ChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
      />
    </Container>
  );
};

export default UserProfile;
