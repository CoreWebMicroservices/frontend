import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Tab, Container } from 'react-bootstrap';
import UserEditForm from '@/user/component/user/UserEdit';
import { MessageList } from '@/communication/component/MessageList';
import Breadcrumb from '@/common/component/Breadcrumb';
import { ROUTE_PATHS } from '@/app/router/routes';

const UserEdit: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeKey, setActiveKey] = React.useState<string>('edit');

  return (
    <Container>
      <Breadcrumb
        items={[
          { label: 'All Users', href: ROUTE_PATHS.USERS_LIST },
          { label: 'Edit User', active: true }
        ]}
      />

      <Tabs activeKey={activeKey} onSelect={(k) => k && setActiveKey(k)} className="mb-3">
        <Tab eventKey="edit" title="Edit">
          {/* Render the existing user edit form (it uses useParams internally) */}
          <UserEditForm />
        </Tab>
        <Tab eventKey="messages" title="Messages">
          {/* Show messages filtered by userId when available */}
          <div style={{ marginTop: 8 }}>
            <MessageList userId={userId} />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserEdit;
