
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import AppTheme from '@/app/layout/AppTheme';
import { BoxArrowInRight } from 'react-bootstrap-icons';
import { APP_ROUTES } from '@/app/router/routes';

// App layer can import components from any module for composition
import AuthNavBar from '@/user/component/auth/AuthNavBar';
import UserNavBar from '@/user/component/user/UserNavBar';
import { getCurrentUserAuth, hasAnyRole } from '@/user/store/AuthState';
import { createAuthGuards } from '@/common/router/AuthGuards';
import { AppRoles } from '@/common/AppRoles';

// Create auth guards for this component
const authGuards = createAuthGuards({
  homeRoute: APP_ROUTES.HOME,
  loginRoute: APP_ROUTES.LOGIN,
  authFunctions: {
    getCurrentUserAuth,
    hasAnyRole,
  },
});


const AppHeader = () => {
  return (
    <Navbar expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to={APP_ROUTES.HOME}>CoreMs</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={APP_ROUTES.FEATURES}>Features</Nav.Link>
            {/* App controls component visibility with business logic */}
            {authGuards.hasAnyRole([AppRoles.UserMsAdmin]) && <UserNavBar />}
          </Nav>
          <Nav className="align-items-center">
            <AppTheme />
            {authGuards.isAuthenticated() ? (
              <AuthNavBar />
            ) : (
              <Nav.Link as={Link} to={APP_ROUTES.LOGIN} title="Login">
                <BoxArrowInRight size={22} />
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};


export default AppHeader;