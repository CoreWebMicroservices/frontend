import { useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '@/user/component/auth/SignUpForm';
import { GOOGLE_AUTH_URL, GITHUB_AUTH_URL, LINKEDIN_AUTH_URL } from "@/user/config";
import { useAuthState } from '@/user/store/AuthState';
import { ROUTE_PATHS } from '@/app/router/routes';

const HomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const authState = useAuthState();
  const [showRegister, setShowRegister] = useState(false);

  const isAuthenticated = authState.isAuthenticated.get();
  const user = authState.user.get();

  const handleSignedUp = () => {
    setShowRegister(false);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section py-5 mb-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <Row className="align-items-center min-vh-50">
            <Col lg={7} className="text-white">
              {isAuthenticated && user ? (
                <>
                  <h1 className="display-3 fw-bold mb-4">
                    {t('home.hero.welcomeBack', 'Welcome Back, {{name}}!', { name: user.firstName })}
                  </h1>
                  <p className="lead mb-4 fs-4">
                    {t('home.hero.welcomeMessage', 'This applications is just a frontend showcase. Explore the features of it or jump right into building your next great application.')}
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <Button 
                      size="lg" 
                      variant="light" 
                      className="px-4 py-3"
                      onClick={() => navigate('/welcome')}
                    >
                      {t('home.hero.explore', 'Explore Features')}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline-light" 
                      className="px-4 py-3"
                      onClick={() => navigate('/docs/introduction')}
                    >
                      <i className="bi bi-book me-2"></i>
                      {t('home.hero.documentation', 'Documentation')}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="display-3 fw-bold mb-4">
                    {t('home.hero.title', 'Enterprise-Grade Architecture Made Simple')}
                  </h1>
                  <p className="lead mb-4 fs-4">
                    {t('home.hero.subtitle', 'Deploy production-ready microservices in minutes, not months. Complete infrastructure, CI/CD pipelines, and cloud deployment - all configured and ready to scale.')}
                  </p>
                  <div className="d-flex gap-3 flex-wrap">
                    <Button 
                      size="lg" 
                      variant="light" 
                      className="px-4 py-3"
                      onClick={() => setShowRegister(true)}
                    >
                      {t('home.hero.getStarted', 'Get Started Free')}
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline-light" 
                      className="px-4 py-3"
                      onClick={() => navigate('/docs/introduction')}
                    >
                      <i className="bi bi-book me-2"></i>
                      {t('home.hero.documentation', 'Documentation')}
                    </Button>
                  </div>
                </>
              )}
            </Col>
            <Col lg={5} className="mt-4 mt-lg-0">
              {!isAuthenticated && showRegister ? (
                <Card className="shadow-lg border-0">
                  <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">{t('auth.signUp', 'Sign Up')}</h4>
                      <Button 
                        variant="link" 
                        className="text-decoration-none p-0"
                        onClick={() => setShowRegister(false)}
                      >
                        <i className="bi bi-x-lg"></i>
                      </Button>
                    </div>
                    <SignUpForm onSignedUp={handleSignedUp} />
                    <div className="text-center my-3">
                      <small className="text-muted">{t('common.or', 'or')}</small>
                    </div>
                    <div className="d-flex gap-2 flex-column">
                      <a href={GOOGLE_AUTH_URL} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center">
                        <i className="bi bi-google me-2"></i>
                        {t('auth.continueGoogle', 'Google')}
                      </a>
                      <a href={GITHUB_AUTH_URL} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center">
                        <i className="bi bi-github me-2"></i>
                        {t('auth.continueGithub', 'GitHub')}
                      </a>
                      <a href={LINKEDIN_AUTH_URL} className="btn btn-outline-primary btn-sm d-flex align-items-center justify-content-center">
                        <i className="bi bi-linkedin me-2"></i>
                        {t('auth.continueLinkedin', 'LinkedIn')}
                      </a>
                    </div>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="shadow-lg border-0 bg-white bg-opacity-10 text-white">
                  <Card.Body className="p-4">
                    <h5 className="mb-3">{t('home.hero.quickStart', 'Quick Start')}</h5>
                    <pre className="bg-dark bg-opacity-50 p-3 rounded text-white-50 small">
                      <code>
{`git clone https://github.com/
  CoreWebMicroservices/
  corems-project.git
cd corems-project
./setup.sh init-all
./setup.sh start-all`}
                      </code>
                    </pre>
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <Container className="my-5 py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold mb-3">
            {t('home.features.title', 'Everything You Need to Launch')}
          </h2>
          <p className="lead text-muted">
            {t('home.features.subtitle', 'Production-grade services ready to integrate into your application')}
          </p>
        </div>
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm bg-body">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-people-fill fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">{t('home.features.userManagement', 'User Management')}</h5>
                <p className="text-muted">
                  {t('home.features.userManagementDesc', 'Complete authentication system with JWT, OAuth2 (Google, GitHub, LinkedIn), role-based access control, and user profiles.')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm bg-body">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-envelope-fill fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">{t('home.features.communication', 'Communication Hub')}</h5>
                <p className="text-muted">
                  {t('home.features.communicationDesc', 'Multi-channel messaging with email, SMS, and push notifications. Template management and delivery tracking included.')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm bg-body">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-file-earmark-text-fill fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">{t('home.features.documents', 'Document Management')}</h5>
                <p className="text-muted">
                  {t('home.features.documentsDesc', 'S3-compatible storage with MinIO. Upload, organize, and secure your files with built-in access control.')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm bg-body">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-credit-card-fill fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">{t('home.features.payments', 'Payment Processing')}</h5>
                <p className="text-muted">
                  {t('home.features.paymentsDesc', 'Integrated payment gateways: Stripe, PayPal, Klarna, and more. Subscription billing and invoice management.')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm bg-body">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-clipboard-check-fill fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">{t('home.features.forms', 'Dynamic Forms')}</h5>
                <p className="text-muted">
                  {t('home.features.formsDesc', 'Build surveys, questionnaires, and custom forms. Collect data with validation and conditional logic.')}
                </p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="h-100 border-0 shadow-sm bg-body">
              <Card.Body className="p-4">
                <div className="mb-3">
                  <i className="bi bi-file-code-fill fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold mb-3">{t('home.features.templates', 'Template Engine')}</h5>
                <p className="text-muted">
                  {t('home.features.templatesDesc', 'HTML templates for emails, documents, and reports. Version control and preview included.')}
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Who Is This For Section */}
      <section className="bg-body-secondary py-5">
        <Container className="my-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">
              {t('home.audience.title', 'Built For Modern Teams')}
            </h2>
          </div>
          <Row className="g-4">
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-rocket-takeoff fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold">{t('home.audience.startups', 'Startup Founders')}</h5>
                <p className="text-muted">
                  {t('home.audience.startupsDesc', 'Launch your MVP in weeks, not months')}
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-building fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold">{t('home.audience.companies', 'Small Companies')}</h5>
                <p className="text-muted">
                  {t('home.audience.companiesDesc', 'Enterprise features without enterprise costs')}
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-code-slash fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold">{t('home.audience.developers', 'Developers')}</h5>
                <p className="text-muted">
                  {t('home.audience.developersDesc', 'Build side projects with production quality')}
                </p>
              </div>
            </Col>
            <Col md={6} lg={3}>
              <div className="text-center">
                <div className="mb-3">
                  <i className="bi bi-mortarboard fs-1 text-primary"></i>
                </div>
                <h5 className="fw-bold">{t('home.audience.students', 'Students')}</h5>
                <p className="text-muted">
                  {t('home.audience.studentsDesc', 'Learn enterprise architecture patterns')}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <Container className="my-5 py-5">
        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <h2 className="display-5 fw-bold mb-4">
              {t('home.benefits.title', 'Why Choose Core Microservices?')}
            </h2>
            <div className="mb-4">
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="fw-bold">{t('home.benefits.saveTime', 'Deploy in Minutes, Not Months')}</h5>
                  <p className="text-muted">
                    {t('home.benefits.saveTimeDesc', 'Pre-configured CI/CD pipelines, Docker containers, and Terraform scripts. Push to production on day one.')}
                  </p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="fw-bold">{t('home.benefits.production', 'Battle-Tested & Production-Ready')}</h5>
                  <p className="text-muted">
                    {t('home.benefits.productionDesc', 'Enterprise security, monitoring with Prometheus, distributed tracing, and auto-scaling built in.')}
                  </p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="fw-bold">{t('home.benefits.cloud', 'Multi-Cloud Ready')}</h5>
                  <p className="text-muted">
                    {t('home.benefits.cloudDesc', 'Deploy to AWS, Azure, or GCP with included Terraform modules. Kubernetes manifests and Helm charts included.')}
                  </p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="fw-bold">{t('home.benefits.documentation', 'Complete Documentation & Training')}</h5>
                  <p className="text-muted">
                    {t('home.benefits.documentationDesc', 'Step-by-step guides, API documentation, video tutorials, and live demo applications.')}
                  </p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="fw-bold">{t('home.benefits.cicd', 'Automated CI/CD Pipelines')}</h5>
                  <p className="text-muted">
                    {t('home.benefits.cicdDesc', 'GitHub Actions workflows for testing, building, and deploying. Automated security scanning and quality gates.')}
                  </p>
                </div>
              </div>
              <div className="d-flex mb-3">
                <div className="me-3">
                  <i className="bi bi-check-circle-fill fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="fw-bold">{t('home.benefits.free', 'Free & Open Source')}</h5>
                  <p className="text-muted">
                    {t('home.benefits.freeDesc', 'Apache 2.0 license. Use commercially without restrictions. Active community support.')}
                  </p>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <Card className="border-0 shadow-lg bg-body">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">{t('home.benefits.techStack', 'Modern Tech Stack')}</h4>
                <Row className="g-3">
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-cup-hot-fill me-2 text-primary"></i>
                      <strong>Java 25</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-leaf-fill me-2 text-success"></i>
                      <strong>Spring Boot 4.0</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-database-fill me-2 text-info"></i>
                      <strong>PostgreSQL</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-box-fill me-2 text-primary"></i>
                      <strong>Docker</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-react me-2 text-info"></i>
                      <strong>React 18+</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-code-square me-2 text-primary"></i>
                      <strong>TypeScript</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-hdd-rack-fill me-2 text-warning"></i>
                      <strong>RabbitMQ</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-shield-check me-2 text-success"></i>
                      <strong>JWT Auth</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-cloud-fill me-2 text-info"></i>
                      <strong>Terraform</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-gear-fill me-2 text-primary"></i>
                      <strong>Kubernetes</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-graph-up me-2 text-success"></i>
                      <strong>Prometheus</strong>
                    </div>
                  </Col>
                  <Col xs={6}>
                    <div className="p-3 bg-body-secondary rounded">
                      <i className="bi bi-github me-2 text-dark"></i>
                      <strong>GitHub Actions</strong>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <section className="py-5 my-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Container>
          <Row className="text-center text-white">
            <Col>
              <h2 className="display-5 fw-bold mb-4">
                {t('home.cta.title', 'Ready to Build at Enterprise Scale?')}
              </h2>
              <p className="lead mb-4">
                {t('home.cta.subtitle', 'Join thousands of developers shipping production-ready applications with Core Microservices')}
              </p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Button 
                  size="lg" 
                  variant="light" 
                  className="px-5 py-3"
                  onClick={() => {
                    setShowRegister(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  {t('home.cta.getStarted', 'Get Started Now')}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline-light" 
                  className="px-5 py-3"
                  href="https://github.com/CoreWebMicroservices/corems-project"
                  target="_blank"
                >
                  {t('home.cta.documentation', 'View Documentation')}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <Container className="py-4">
        <Row className="text-center text-muted">
          <Col>
            <p className="mb-2">
              <i className="bi bi-github me-2"></i>
              <a 
                href="https://github.com/CoreWebMicroservices/corems-project" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-decoration-none"
              >
                {t('home.footer.github', 'View on GitHub')}
              </a>
            </p>
            <p className="small">
              {t('home.footer.license', 'Licensed under Apache 2.0 - Free for commercial use')}
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
