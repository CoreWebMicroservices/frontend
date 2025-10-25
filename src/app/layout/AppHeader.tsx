

import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import AppTheme from '@/app/layout/AppTheme';
import AuthNavBar from '@/user/component/auth/AuthNavBar';
import { BoxArrowInRight } from 'react-bootstrap-icons';

import { ROUTE_HOME, ROUTE_LOGIN, ROUTE_USER, ROUTE_FEATURES, ROUTE_PRICING } from '@/app/Router';
import { useAuthState, signOut } from '@/user/store/AuthState';


const AppHeader = () => {
  const authState = useAuthState();

  return (
    <Navbar expand="lg" className="bg-body-tertiary mb-4">
      <Container fluid>
        <Navbar.Brand as={Link} to={ROUTE_HOME}>CoreMs</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROUTE_FEATURES}>Features</Nav.Link>
            <Nav.Link as={Link} to={ROUTE_PRICING}>Pricing</Nav.Link>
          </Nav>
          <Nav className="align-items-center">
            <AppTheme />
            {authState.isAuthenticated.get() ? (
              <AuthNavBar />
            ) : (
              <Nav.Link as={Link} to={ROUTE_LOGIN} title="Login">
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