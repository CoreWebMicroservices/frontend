import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Spinner, ButtonGroup, Dropdown } from 'react-bootstrap';
import { ArrowLeft, Lock, X, Plus } from 'react-bootstrap-icons';
import { User, AuthProvider } from '@/user/model/User';
import { useUserState, getUserById, updateUserInfo } from '@/user/store/UserState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/utils/api/ApiResponseAlertComponent';
import AdminChangePasswordModal from './AdminChangePasswordModal';
import { AppRoles } from '@/common/AppRoles';


interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
}

const UserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const userState = useUserState();
  const selectedUser = userState.selectedUser.get();
  const isLoading = userState.isInProgress.get();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<UserFormValues>();
  const { success: updateSuccess, initialErrorMessage: updateInitialError, errors: updateErrors, handleResponse } = useMessageState();

  const roles = watch('roles') || [];

  useEffect(() => {
    if (userId) {
      const loadUser = async () => {
        const result = await getUserById(userId);

        if (result.result && result.response) {
          reset({
            firstName: result.response.firstName,
            lastName: result.response.lastName,
            email: result.response.email,
            roles: result.response.roles ? [...result.response.roles] : [],
          });
        }
      };
      loadUser();
    }
  }, [userId, reset]);

  const onSubmit = async (data: UserFormValues) => {
    if (!userId) return;

    const userData: User = {
      userId: userId,
      provider: selectedUser?.provider || AuthProvider.local,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      roles: data.roles,
      imageUrl: selectedUser?.imageUrl,
      createdAt: selectedUser?.createdAt,
      updatedAt: new Date().toISOString(),
      lastLoginAt: selectedUser?.lastLoginAt,
    };

    const result = await updateUserInfo(userId, userData);
    handleResponse(
      result,
      'Failed to update user information.',
      'User information has been updated successfully.'
    );
  };

  const addRole = (role: string) => {
    const currentRoles = roles || [];
    if (!currentRoles.includes(role)) {
      const newRoles = [...currentRoles, role];
      setValue('roles', newRoles);
    }
  };

  const removeRole = (role: string) => {
    const currentRoles = roles || [];
    const newRoles = currentRoles.filter(r => r !== role);
    setValue('roles', newRoles);
  };

  // Get available roles from AppRoles enum that are not already assigned
  const getAvailableRoles = () => {
    const allRoles = Object.values(AppRoles);
    const currentRoles = roles || [];
    return allRoles.filter(role => !currentRoles.includes(role));
  };

  const handleBack = () => {
    navigate('/users');
  };

  if (isLoading && !selectedUser) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  if (!selectedUser) {
    return (
      <Container>
        <div className="text-center mt-5">
          <h4>User not found</h4>
          <Button variant="primary" onClick={handleBack}>
            <ArrowLeft className="me-2" />
            Back to Users
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button variant="outline-primary" onClick={handleBack} className="mb-3">
            <ArrowLeft className="me-2" />
            Back to Users
          </Button>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <h2 className="mb-4 mt-3 text-center">Edit User</h2>

          {/* User Avatar Display (Non-editable) */}
          {selectedUser.imageUrl ? (
            <div className="mb-3 text-center">
              <img
                src={selectedUser.imageUrl}
                alt="User avatar"
                style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--bs-primary)' }}
              />
            </div>
          ) : (
            <div className="mb-3 text-center">
              <div style={{
                width: 96,
                height: 96,
                borderRadius: '50%',
                background: '#e9ecef',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bs-primary)',
                fontSize: 32,
                fontWeight: 'bold',
                color: '#6c757d',
                margin: '0 auto'
              }}>
                {selectedUser.firstName?.charAt(0)}{selectedUser.lastName?.charAt(0)}
              </div>
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
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                disabled
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Roles Section within the form */}
            <Form.Group className="mb-3" controlId="roles">
              <Form.Label>User Roles</Form.Label>
              <div className="border rounded p-3 bg-light">
                {/* Current Roles - Button Groups */}
                <div className="mb-3">
                  {roles.length > 0 ? (
                    <div className="d-flex flex-wrap gap-2">
                      {roles.map((role) => (
                        <ButtonGroup key={role} size="sm">
                          <Button variant="outline-primary" disabled>
                            {role}
                          </Button>
                          <Button
                            variant="outline-danger"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              removeRole(role);
                            }}
                            title={`Remove ${role} role`}
                          >
                            <X size={14} />
                          </Button>
                        </ButtonGroup>
                      ))}
                    </div>
                  ) : (
                    <div className="text-muted fst-italic mb-2">No roles assigned</div>
                  )}
                </div>

                {/* Add Role Dropdown */}
                {getAvailableRoles().length > 0 && (
                  <Dropdown>
                    <Dropdown.Toggle size="sm" variant="outline-success">
                      Add role
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {getAvailableRoles().map((role) => (
                        <Dropdown.Item
                          key={role}
                          onClick={(e) => {
                            e.preventDefault();
                            addRole(role);
                          }}
                        >
                          {role}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
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
          <h2 className="mb-4 mt-3 text-center">Account Information</h2>

          {/* Account Details Card */}
          <Card>
            <Card.Body>
              <p className="mb-2"><strong>User ID:</strong> <span className="text-muted">{selectedUser.userId}</span></p>
              <p className="mb-2"><strong>Provider:</strong> <span className="text-muted">{selectedUser.provider}</span></p>
              {selectedUser.createdAt && (
                <p className="mb-2"><strong>Created:</strong> <span className="text-muted">{new Date(selectedUser.createdAt).toLocaleDateString()}</span></p>
              )}
              {selectedUser.lastLoginAt && (
                <p className="mb-0"><strong>Last Login:</strong> <span className="text-muted">{new Date(selectedUser.lastLoginAt).toLocaleDateString()}</span></p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admin Change Password Modal */}
      <AdminChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        userId={userId || ''}
        userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
      />
    </Container>
  );
};

export default UserEdit;