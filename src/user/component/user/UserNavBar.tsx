import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/router/routes';

const UserNavBar = () => {
  const location = useLocation();

  return (
    <Nav.Link
      as={Link}
      to={ROUTE_PATHS.USERS_LIST}
      active={location.pathname === ROUTE_PATHS.USERS_LIST}
    >
      Users
    </Nav.Link>
  );
};

export default UserNavBar;