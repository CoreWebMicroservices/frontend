import { Link } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

interface TranslationNavBarProps {
  path: string;
}

const TranslationNavBar = ({ path }: TranslationNavBarProps) => {
  return (
    <Nav.Item>
      <Nav.Link as={Link} to={path}>
        Translations
      </Nav.Link>
    </Nav.Item>
  );
};

export default TranslationNavBar;
