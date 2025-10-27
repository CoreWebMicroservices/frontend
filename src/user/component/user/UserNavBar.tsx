import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAuthState } from '@/user/store/AuthState';
import { AppRoles } from '@/common/AppRoles';

const UserNavBar = () => {
  const authState = useAuthState();
  const location = useLocation();
  const user = authState.user.get();

  if (!authState.isAuthenticated.get() || (!user?.roles.includes(AppRoles.SuperAdmin) && !user?.roles.includes(AppRoles.UserMsAdmin))) {
    return null;
  }

  return (
    <Nav.Link
      as={Link}
      to="/users"
      active={location.pathname === '/users'}
    >
      Users
    </Nav.Link>
  );
};

export default UserNavBar;