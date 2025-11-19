import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const CommunicationNavBar = ({ path }: { path: string }) => {
  const location = useLocation();

  return (
    <Nav.Item>
      <Nav.Link
        as={Link}
        to={path}
        active={location.pathname === path}
      >
        Communication
      </Nav.Link>
    </Nav.Item>
  );
};

export default CommunicationNavBar;