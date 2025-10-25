import { useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL, LINKEDIN_AUTH_URL } from "@/user/config";


const AuthForm = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [isSignedUp, setIsSignedUp] = useState(false);

  const handleSignUp = () => {
    setIsSignedUp(true);
    setIsSignIn(true);
  };

  return (
    <Container>
      <Row>
        <Col xs={12}>
          <div className="mb-5 text-center">
            <h2 className="display-5 fw-bold">{isSignIn ? 'Sign In' : 'Sing Up'}</h2>
            <p className="m-0">
              {
                isSignIn
                  ? <>Don't have an account? <a href="#signup" onClick={() => setIsSignIn(false)}>Sign Up</a></>
                  : <>Already have an account? <a href="#signin" onClick={() => setIsSignIn(true)}>Sign In</a></>
              }
            </p>
          </div>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xs={12} lg={4}>
          {isSignedUp ? <p className="fw-bold text-center">Thank you for registration. Please login.</p> : null}
          {isSignIn ? <SignInForm /> : <SignUpForm onSignedUp={handleSignUp} />}
        </Col>
        <Col xs={12} lg={2} className="d-flex align-items-center justify-content-center gap-3 flex-lg-column mb-4">
          <div className="bg-dark h-100 d-none d-lg-block" style={{ width: '1px', opacity: 0.1 }}></div>
          <div className="bg-dark w-100 d-lg-none" style={{ height: '1px', opacity: 0.1 }}></div>
          <div>or</div>
          <div className="bg-dark h-100 d-none d-lg-block" style={{ width: '1px', opacity: 0.1 }}></div>
          <div className="bg-dark w-100 d-lg-none" style={{ height: '1px', opacity: 0.1 }}></div>
        </Col>
        <Col xs={12} lg={4} className="d-flex align-items-center">
          <div className="d-flex gap-3 flex-column w-100">
            <a href={GOOGLE_AUTH_URL} className="btn btn-outline-primary d-flex align-items-center py-2 px-4">
              <i className="bi bi-google"></i>
              <span className="ms-2 fs-6 flex-grow-1">Continue with Google</span>
            </a>
            <a href={GITHUB_AUTH_URL} className="btn btn-outline-primary d-flex align-items-center py-2 px-4">
              <i className="bi bi-github"></i>
              <span className="ms-2 fs-6 flex-grow-1">Continue with GitHub</span>
            </a>
            <a href={LINKEDIN_AUTH_URL} className="btn btn-outline-primary d-flex align-items-center py-2 px-4">
              <i className="bi bi-linkedin"></i>
              <span className="ms-2 fs-6 flex-grow-1">Continue with LinkedIn</span>
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthForm;