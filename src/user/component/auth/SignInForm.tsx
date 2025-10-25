import * as yup from 'yup';
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { signInUser } from "@/user/store/AuthState";
import { SignInUserRequest } from "@/user/model/Auth";
import { ROUTE_HOME } from "@/app/Router";


const signInSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});


const SignInForm = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });


  const onSubmit = async (data: SignInUserRequest) => {
    const res = await signInUser(data);
    if (res.result === true) {
      navigate(ROUTE_HOME);
    } else {
      Object.values(res.errors).forEach((error) => {
        setError("root", {
          type: 'server',
          message: error.description,
        });
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
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
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
          required
          autoComplete="current-password"
          isInvalid={!!errors.password}
          {...register('password')}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </FloatingLabel>
      <div className="d-grid mb-3">
        <span className="error text-danger px-2">{errors.root?.message}</span>
      </div>
      <Row className="justify-content-cenmt mb-3">
        <Col xs={{ span: 6, offset: 6 }} className="text-end">
          <Link to={'forgot_password'} className="link-secondary text-decoration-none">Forgot password?</Link>
        </Col>
      </Row>
      <div className="d-grid mb-3">
        <Button size="lg" type="submit" disabled={isSubmitting} className="rounded-1 fs-6 py-2">Sign In</Button>
      </div>
    </Form>
  );
};

export default SignInForm;