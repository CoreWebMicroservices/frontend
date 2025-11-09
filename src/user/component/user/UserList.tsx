import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { PencilSquare, Plus } from 'react-bootstrap-icons';
import { useUserState, getAllUsers, setSearch, setPage, setPageSize, setFilter, setSort } from '@/user/store/UserState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/component/ApiResponseAlert';
import { DataTable } from '@/common/component/dataTable';
import type { DataTableColumn, DataTableFilter } from '@/common/component/dataTable';
import type { User } from '@/user/model/User';

const UserAvatar = ({ user }: { user: { imageUrl?: string; firstName: string; lastName: string } }) => {
  if (user.imageUrl) {
    return (
      <img
        src={user.imageUrl}
        alt="Avatar"
        className="rounded-circle me-3"
        style={{ width: 32, height: 32, objectFit: 'cover' }}
      />
    );
  }

  return (
    <div
      className="rounded-circle me-3 d-flex align-items-center justify-content-center"
      style={{
        width: 32,
        height: 32,
        backgroundColor: '#e9ecef',
        fontSize: 12,
        fontWeight: 'bold',
        color: '#6c757d',
      }}
    >
      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
    </div>
  );
};

const UserList = () => {
  const navigate = useNavigate();
  const userState = useUserState();
  const users = userState.users.get();
  const isLoading = userState.isInProgress.get();
  const queryParams = userState.queryParams.get();
  const pagedResponse = userState.pagedResponse.get();

  const { initialErrorMessage, errors } = useMessageState();

  // Configuration for DataTable
  const columns: DataTableColumn[] = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'provider', title: 'Provider', sortable: true },
    { key: 'lastLogin', title: 'Last Login', sortable: true },
    { key: 'actions', title: 'Actions' }
  ];

  // Helper function to parse current sort
  const parseCurrentSort = (sort?: string) => {
    if (!sort) return undefined;
    const [field, direction] = sort.split(':');
    return { field, direction: direction as 'asc' | 'desc' };
  };

  const currentSort = parseCurrentSort(queryParams.sort);

  const filters: DataTableFilter[] = [
    {
      key: 'provider',
      label: 'Provider',
      type: 'select',
      placeholder: 'All Providers',
      options: [
        { value: 'google', label: 'Google' },
        { value: 'github', label: 'GitHub' },
        { value: 'local', label: 'Local' }
      ]
    }
  ];


  // Render row function for DataTable
  const renderUserRow = (user: User) => (
    <tr key={user.userId}>
      <td>
        <div className="d-flex align-items-center">
          <UserAvatar user={user} />
          <span className="fw-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </td>
      <td>{user.email}</td>
      <td>{user.provider}</td>
      <td>{user.lastLoginAt}</td>
      <td>
        <Link to={`/users/${user.userId}`}>
          <Button variant="outline-primary" size="sm">
            <PencilSquare className="me-1" />
            Edit
          </Button>
        </Link>
      </td>
    </tr>
  );

  // Actions component
  const actions = (
    <Button variant="primary" onClick={() => navigate('/users/add')}>
      <Plus className="me-2" />
      Add New User
    </Button>
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <>
      <AlertMessage initialErrorMessage={initialErrorMessage} errors={errors} />

      <DataTable
        // Data
        items={users as User[]}
        pagination={pagedResponse ? {
          page: pagedResponse.page,
          pageSize: pagedResponse.pageSize,
          totalElements: pagedResponse.totalElements,
          totalPages: pagedResponse.totalPages
        } : undefined}
        isLoading={isLoading}

        // Configuration
        columns={columns}
        filters={filters}
        filterValues={queryParams.filters || {}}
        sortableFields={columns.filter(col => col.sortable).map(col => col.key)}
        currentSort={currentSort}
        searchPlaceholder="Search users by name or email..."

        // Callbacks
        onSearch={setSearch}
        onFilter={setFilter}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onSort={setSort}

        // Render function
        renderRow={renderUserRow}

        // Customization
        title="All Users"
        actions={actions}
      />
    </>
  );
};

export default UserList;