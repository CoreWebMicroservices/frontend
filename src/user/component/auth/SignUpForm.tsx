import * as yup from 'yup';
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";

import { SignUpUserRequest } from "@/user/model/Auth";
import { signUpUser } from "@/user/store/AuthState";
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/utils/api/ApiResponseAlertComponent';

const signUpUserSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup.string().required('Password is required'),
});


interface SignUpFormProps {
  onSignedUp: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSignedUp }) => {
  const { success, initialErrorMessage, errors: apiErrors, handleResponse } = useMessageState();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpUserSchema),
  });

  const onSubmit = async (data: SignUpUserRequest) => {
    const res = await signUpUser(data);
    handleResponse(
      res,
      "Account created successfully! Please check your email to verify your account.",
      "Failed to create account. Please check the information and try again."
    );

    if (res.result === true) {
      onSignedUp();
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="needs-validation">
      <AlertMessage success={success} initialErrorMessage={initialErrorMessage} errors={apiErrors} />

      <FloatingLabel
        controlId="floatingEmail"
        label="Email"
        className="mb-3"
      >
        <Form.Control
          type="email"
          placeholder="Enter email"
          size="lg"
          className="border-0 border-bottom rounded-0"
          autoComplete="email"
          isInvalid={!!errors.email}
          {...register('email')}
        />
      </FloatingLabel>
      <Row>
        <Col md={6}>
          <FloatingLabel
            controlId="firstName"
            label="First Name"
            className="mb-3"
          >
            <Form.Control
              type="input"
              placeholder="First Name"
              size="lg"
              className="border-0 border-bottom rounded-0"
              autoComplete="first-name"
              isInvalid={!!errors.firstName}
              {...register('firstName')}
            />
          </FloatingLabel>
        </Col>
        <Col md={6}>
          <FloatingLabel
            controlId="lastName"
            label="Last Name"
            className="mb-3"
          >
            <Form.Control
              type="input"
              placeholder="Last Name"
              size="lg"
              className="border-0 border-bottom rounded-0"
              autoComplete="last-name"
              isInvalid={!!errors.lastName}
              {...register('lastName')}
            />
          </FloatingLabel>
        </Col>
      </Row>

      <FloatingLabel
        controlId="floatingPassword"
        label="Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder="Password"
          size="lg"
          className="border-0 border-bottom rounded-0"
          autoComplete="new-password"
          isInvalid={!!errors.password}
          {...register('password')}
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingConfirmPassword"
        label="Confirm Password"
        className="mb-3"
      >
        <Form.Control
          type="password"
          placeholder="Password"
          size="lg"
          className="border-0 border-bottom rounded-0"
          autoComplete="new-password"
          isInvalid={!!errors.confirmPassword}
          {...register('confirmPassword')}
        />
      </FloatingLabel>
      <div className="d-grid mb-3">
        <Button size="lg" type="submit" disabled={isSubmitting} className="fs-6 py-2">
          Register new account
        </Button>
      </div>
    </Form>
  );
};

export default SignUpForm;