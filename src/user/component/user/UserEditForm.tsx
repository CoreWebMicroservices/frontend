import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useUserState, getUserInfo } from '@/user/store/UserState';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { get } from 'node_modules/axios/index.d.cts';
import Spinner from 'react-bootstrap/Spinner';

interface UserFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

const UserForm = () => {
  const userState = useUserState();
  const user = userState.user.get();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>();


  const onSubmit = async (data: UserFormValues) => {
    // TODO: Implement update user API call
    alert('User update not implemented yet!');
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
  }, []);

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

export default UserForm;
