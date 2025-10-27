import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Table, Spinner, Badge } from 'react-bootstrap';
import { PencilSquare, PersonFill } from 'react-bootstrap-icons';
import { User } from '@/user/model/User';
import UserNavBar from '@/user/component/user/UserNavBar';
import { AppRoles } from '@/common/AppRoles';

// Mock data for now - replace with actual API call
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@example.com',
    firstName: 'John',
    lastName: 'Doe',
    roles: [AppRoles.UserMsUser],
  },
  {
    id: '2',
    email: 'jane.admin@example.com',
    firstName: 'Jane',
    lastName: 'Admin',
    roles: [AppRoles.UserMsUser],
  },
  {
    id: '3',
    email: 'bob.smith@example.com',
    firstName: 'Bob',
    lastName: 'Smith',
    roles: [AppRoles.UserMsUser],
  },
];

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const getRoleBadgeVariant = (roles: AppRoles[]) => {
    return roles.includes(AppRoles.UserMsUser) ? 'danger' : 'primary';
  };

  const getRoleText = (roles: AppRoles[]) => {
    return roles.includes(AppRoles.UserMsUser) ? 'Admin' : 'User';
  };

  if (loading) {
    return (
      <Container>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 400 }}>
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h2 className="mb-3">
            <PersonFill className="me-2" />
            User Management
          </h2>
          <p className="text-muted">Manage and edit user accounts</p>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">All Users ({users.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive striped hover className="mb-0">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {user.imageUrl ? (
                            <img
                              src={user.imageUrl}
                              alt="Avatar"
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginRight: 12,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                backgroundColor: '#e9ecef',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: 12,
                                fontSize: 12,
                                fontWeight: 'bold',
                                color: '#6c757d',
                              }}
                            >
                              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                            </div>
                          )}
                          <span className="fw-medium">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <Badge bg={getRoleBadgeVariant(user.roles as AppRoles[])}>
                          {getRoleText(user.roles as AppRoles[])}
                        </Badge>
                      </td>
                      <td>
                        <Link to={`/users/${user.id}`}>
                          <Button
                            variant="outline-primary"
                            size="sm"
                          >
                            <PencilSquare className="me-1" />
                            Edit
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserList;