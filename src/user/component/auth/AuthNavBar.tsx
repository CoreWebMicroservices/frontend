import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from 'react-router-dom';
import { PersonCircle, PencilSquare, BoxArrowRight } from 'react-bootstrap-icons';
import { ROUTE_USER } from '@/app/Router';
import { useAuthState, signOut } from '@/user/store/AuthState';

const AuthNavBar = () => {
  const authState = useAuthState();
  const user = authState.user.get();

  console
  if (!authState.isAuthenticated.get()) return null;

  return (
    <NavDropdown
      align="end"
      title={<PersonCircle size={22} />}
      id="profile-dropdown"
      menuVariant="light"
    >
      <NavDropdown.Item disabled style={{ opacity: 1, fontWeight: 600 }}>
        {user?.firstName} {user?.lastName}
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to={ROUTE_USER}>
        <PencilSquare className="me-2" />Edit Profile
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={signOut} className="text-danger">
        <BoxArrowRight className="me-2" />Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
};

export default AuthNavBar;
