
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import AppTheme from '@/app/layout/AppTheme';
import AuthNavBar from '@/user/component/auth/AuthNavBar';
import { BoxArrowInRight } from 'react-bootstrap-icons';
import { useAuthState } from '@/user/store/AuthState';

import { USER_ROUTE_PATHS } from '@/user/UserRouter';
import { APP_ROUTES } from '@/app/Router';


const AppHeader = () => {
  const authState = useAuthState();

  return (
    <Navbar expand="lg" className="mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to={APP_ROUTES.HOME}>CoreMs</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={APP_ROUTES.FEATURES}>Features</Nav.Link>
            <Nav.Link as={Link} to={APP_ROUTES.PRICING}>Pricing</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            <AppTheme />
            {authState.isAuthenticated.get() ? (
              <AuthNavBar />
            ) : (
              <Nav.Link as={Link} to={USER_ROUTE_PATHS.LOGIN} title="Login">
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