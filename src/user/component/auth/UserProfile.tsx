import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserState, getUserInfo, updateUserInfo } from '@/user/store/UserState';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import UserNavBar from '@/user/component/user/UserNavBar';

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const UserProfile = () => {
  const userState = useUserState();
  const user = userState.user.get();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>();

  const onSubmit = async (data: UserFormValues) => {
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const updatedUser = await updateUserInfo(data);
      if (updatedUser) {
        // Refresh tokens to update user data in JWT
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Force token refresh to get updated user data
          window.location.reload(); // Simple approach to refresh all auth state
        }
        setUpdateSuccess(true);
        setTimeout(() => setUpdateSuccess(false), 5000);
      } else {
        setUpdateError('Failed to update user information');
      }
    } catch (error) {
      setUpdateError('An error occurred while updating your profile');
      console.error('Update error:', error);
    }
  };

  useEffect(() => {
    getUserInfo().then(user => {
      if (user) {
        reset({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
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
    <Container style={{ maxWidth: 480 }}>
      <UserNavBar />

      {updateSuccess && (
        <Alert variant="success" className="mb-3">
          <strong>Success!</strong> Your profile has been updated successfully.
        </Alert>
      )}

      {updateError && (
        <Alert variant="danger" className="mb-3">
          <strong>Error:</strong> {updateError}
        </Alert>
      )}

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
      <Form onSubmit={handleSubmit(onSubmit)}>
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
        <Button variant="primary" type="submit" disabled={isSubmitting}>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default UserProfile;
