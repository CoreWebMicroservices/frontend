import * as yup from 'yup';
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";

import { SignUpUserRequest } from "@/user/model/Auth";
import { signUpUser } from "@/user/store/AuthState";
import { AuthErrorReasonCode } from '@/common/model/CoreMsApiModel';

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
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signUpUserSchema),
  });

  const onSubmit = async (data: SignUpUserRequest) => {
    const res = await signUpUser(data);
    console.log(res);
    if (res.result === true) {
      onSignedUp();
    } else {
      Object.values(res.errors).forEach((error) => {
        switch (error.reasonCode) {
          case AuthErrorReasonCode.PROVIDED_VALUE_INVALID:
            if (error.details!.indexOf("password ") !== -1) {
              setError("password", { message: error.details });
              break;
            } else if (error.details!.indexOf("confirmPassword ") !== -1) {
              setError("confirmPassword", { message: error.details });
              break
            } else {
              setError("root", {
                message: error.description,
              });
            }
            break;
          default:
            setError("root", {
              message: error.description,
            });
        }
      });
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit(onSubmit)} className="needs-validation">
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
      <span className="error text-danger px-2">{errors.password?.message}</span>
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
      <span className="error text-danger px-2">{errors.confirmPassword?.message}</span>
      <div className="d-grid mb-3">
        <span className="error text-danger px-2">{errors.root?.message}</span>
      </div>
      <div className="d-grid mb-3">
        <Button variant="dark" size="lg" type="submit" disabled={isSubmitting} className="rounded-0 fs-6 py-2">
          Register new account
        </Button>
      </div>
    </Form>
  );
};

export default SignUpForm;