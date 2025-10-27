import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert, Badge } from 'react-bootstrap';
import { ArrowLeft, PersonFill, Save } from 'react-bootstrap-icons';
import { User } from '@/user/model/User';
import UserNavBar from '@/user/component/user/UserNavBar';
import { AppRoles } from '@/common/AppRoles';

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  isActive: boolean;
}

// Mock user data - replace with actual API call
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: [AppRoles.UserMsUser],
  },
  {
    id: '2',
    email: 'jane.admin@example.com',
    firstName: 'Jane',
    lastName: 'Admin',
    roles: [AppRoles.UserMsUser],
  },
];

const UserEdit = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>();

  useEffect(() => {
    // Simulate API call to get user
    setTimeout(() => {
      const foundUser = mockUsers.find(u => u.id === userId);
      if (foundUser) {
        setUser(foundUser);
        reset({
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          email: foundUser.email,
          roles: foundUser.roles,
          isActive: true, // Add this field to your User model if needed
        });
      }
      setLoading(false);
    }, 1000);
  }, [userId, reset]);

  const onSubmit = async (data: UserFormValues) => {
    try {
      // TODO: Implement user update API call
      console.log('Updating user:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleBack = () => {
    navigate('/users');
  };

  if (loading) {
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

  if (!user) {
    return (
      <Container>
        <Alert variant="danger">
          <h5>User Not Found</h5>
          <p>The requested user could not be found.</p>
          <Button variant="outline-danger" onClick={handleBack}>
            <ArrowLeft className="me-1" />
            Back to User List
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button
            variant="outline-secondary"
            onClick={handleBack}
            className="mb-3"
          >
            <ArrowLeft className="me-1" />
            Back to Users
          </Button>
          <h2 className="mb-3">
            <PersonFill className="me-2" />
            Edit User: {user.firstName} {user.lastName}
          </h2>
        </Col>
      </Row>

      {saveSuccess && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success">
              User updated successfully!
            </Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">User Information</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={6}>
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
                  </Col>
                  <Col md={6}>
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
                  </Col>
                </Row>

                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    isInvalid={!!errors.email}
                    {...register('email', { required: 'Email is required' })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="roles">
                  <Form.Label>User Roles</Form.Label>
                  <div>
                    <Form.Check
                      type="checkbox"
                      label="User"
                      value={AppRoles.UserMsUser}
                      {...register('roles')}
                      defaultChecked={user.roles.includes(AppRoles.UserMsUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Admin"
                      value={AppRoles.UserMsUser}
                      {...register('roles')}
                      defaultChecked={user.roles.includes(AppRoles.UserMsUser)}
                    />
                  </div>
                </Form.Group>

                <Form.Group className="mb-4" controlId="isActive">
                  <Form.Check
                    type="switch"
                    label="Active User"
                    {...register('isActive')}
                    defaultChecked={true}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    <Save className="me-1" />
                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card>
            <Card.Header>
              <h6 className="mb-0">Current Status</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>User ID:</strong> {user.id}
              </div>
              <div className="mb-3">
                <strong>Current Roles:</strong>
                <div className="mt-1">
                  {user.roles.map(role => (
                    <Badge
                      key={role}
                      bg={role === AppRoles.UserMsUser ? 'danger' : 'primary'}
                      className="me-1"
                    >
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <strong>Status:</strong> <Badge bg="success">Active</Badge>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserEdit;