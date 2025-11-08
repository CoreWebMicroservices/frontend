import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { ArrowLeft, PersonFill, Save } from 'react-bootstrap-icons';
import { User, AuthProvider } from '@/user/model/User';
import { useUserState, getUserById, updateUserInfo } from '@/user/store/UserState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/utils/api/ApiResponseAlertComponent';


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


  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm<UserFormValues>();
  const { success: updateSuccess, initialErrorMessage: updateInitialError, errors: updateErrors, handleResponse } = useMessageState();

  const roles = watch('roles') || [];

  const loadUser = useCallback(async (id: string) => {
    const result = await getUserById(id);
    handleResponse(
      result,
      'User loaded successfully.',
      'Failed to load user information.'
    );
  }, []);

  useEffect(() => {
    if (userId) {
      loadUser(userId);
    }
  }, [userId, loadUser]);

  useEffect(() => {
    if (selectedUser) {
      reset({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        roles: selectedUser.roles ? [...selectedUser.roles] : [],
      });
    }
  }, [selectedUser, reset]);

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
      'User information has been updated successfully.',
      'Failed to update user information.'
    );
  };

  const toggleRole = (role: string) => {
    const currentRoles = roles || [];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];
    setValue('roles', newRoles);
  };

  const availableRoles = ['USER', 'ADMIN', 'MODERATOR'];

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
          <h2 className="mb-4 mt-3 text-center">
            <PersonFill className="me-2" />
            Edit User
          </h2>

          <AlertMessage success={updateSuccess} initialErrorMessage={updateInitialError} errors={updateErrors} />

          {/* User Information Form */}
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    isInvalid={!!errors.firstName}
                    {...register('firstName', { required: 'First name is required' })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.firstName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    isInvalid={!!errors.lastName}
                    {...register('lastName', { required: 'Last name is required' })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.lastName?.message}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email address"
                isInvalid={!!errors.email}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-flex justify-content-between">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="primary"
              >
                <Save className="me-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>

              {/* <Button 
                variant="outline-warning"
                onClick={() => setShowPasswordModal(true)}
              >
                <Lock className="me-2" />
                Change Password
              </Button> */}
            </div>
          </Form>
        </Col>

        <Col md={4}>
          <h5 className="mb-3 text-center">User Roles</h5>
          <Card>
            <Card.Body>
              <div className="mb-3">
                <h6>Current Roles:</h6>
                <div className="mb-2">
                  {roles.length > 0 ? (
                    roles.map((role) => (
                      <Badge key={role} bg="primary" className="me-2 mb-2">
                        {role}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">No roles assigned</span>
                  )}
                </div>
              </div>

              <div>
                <h6>Available Roles:</h6>
                {availableRoles.map((role) => (
                  <Form.Check
                    key={role}
                    type="checkbox"
                    label={role}
                    checked={roles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="mb-2"
                  />
                ))}
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-3">
            <Card.Body>
              <h6>Account Information</h6>
              <p className="mb-1"><strong>User ID:</strong> {selectedUser.userId}</p>
              <p className="mb-1"><strong>Provider:</strong> {selectedUser.provider}</p>
              {selectedUser.createdAt && (
                <p className="mb-1"><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              )}
              {selectedUser.lastLoginAt && (
                <p className="mb-1"><strong>Last Login:</strong> {new Date(selectedUser.lastLoginAt).toLocaleDateString()}</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Admin Change Password Modal */}
      {/* <AdminChangePasswordModal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        userId={userId || ''}
        userName={`${selectedUser.firstName} ${selectedUser.lastName}`}
      /> */}
    </Container>
  );
};

export default UserEdit;