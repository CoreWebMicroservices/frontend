import * as yup from 'yup';
import { Button, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { signInUser } from "@/user/store/AuthState";
import { SignInUserRequest } from "@/user/model/Auth";
import { APP_ROUTES } from "@/app/router/routes";
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/component/ApiResponseAlert';


const signInSchema = yup.object().shape({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
});


const SignInForm = () => {
  const navigate = useNavigate();
  const { success, initialErrorMessage, errors: apiErrors, handleResponse } = useMessageState();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });


  const onSubmit = async (data: SignInUserRequest) => {
    const res = await signInUser(data);
    handleResponse(
      res,
      "Failed to sign in. Please check your credentials."
    );

    if (res.result === true) {
      navigate(APP_ROUTES.HOME);
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
          {errors.password?.message}
        </Form.Control.Feedback>
      </FloatingLabel>

      <AlertMessage success={success} initialErrorMessage={initialErrorMessage} errors={apiErrors} />

      <Row className="justify-content-cenmt mb-3">
        <Col xs={{ span: 6, offset: 6 }} className="text-end">
          <Link to={'forgot_password'} className="link-secondary text-decoration-none">Forgot password?</Link>
        </Col>
      </Row>
      <div className="d-grid mb-3">
        <Button size="lg" type="submit" disabled={isSubmitting} className="fs-6 py-2">Sign In</Button>
      </div>
    </Form>
  );
};

export default SignInForm;