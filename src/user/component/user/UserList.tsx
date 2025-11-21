import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { PencilSquare, Plus } from 'react-bootstrap-icons';
import { useHookstate } from '@hookstate/core';
import { getAllUsers } from '@/user/store/UserState';
import { useMessageState } from '@/common/utils/api/ApiResponseHandler';
import { AlertMessage } from '@/common/component/ApiResponseAlert';
import { DataTable } from '@/common/component/dataTable';
import type { DataTableColumn, DataTableFilter } from '@/common/component/dataTable';
import type { User } from '@/user/model/User';
import { APP_ROUTES } from '@/app/router/routes';
import { UserAvatar } from '@/user/component/shared/UserAvatar';
import { parseCurrentSort, getInitialDataTableQueryParams, createDataTableActions } from '@/common/component/dataTable/DataTableState';
import { formatDate } from '@/common/utils/DateUtils';

const UserList = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [pagedResponse, setPagedResponse] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Local state for query params
  const queryParams = useHookstate(getInitialDataTableQueryParams());
  const {
    setSearch,
    setPage,
    setPageSize,
    setFilter,
    setSort
  } = createDataTableActions(queryParams);

  const { initialErrorMessage, errors } = useMessageState();

  useEffect(() => {
    setIsLoading(true);
    getAllUsers(queryParams.get()).then((res) => {
      if (res.result && res.response) {
        setUsers(res.response.items);
        setPagedResponse(res.response);
      }
    }).finally(() => setIsLoading(false));
  }, [JSON.stringify(queryParams.get())]);

  // Configuration for DataTable
  const columns: DataTableColumn[] = [
    { key: 'name', title: 'Name', sortable: true },
    { key: 'email', title: 'Email', sortable: true },
    { key: 'provider', title: 'Provider', sortable: true },
    { key: 'lastLogin', title: 'Last Login', sortable: true },
    { key: 'actions', title: 'Actions' }
  ];

  const currentSort = parseCurrentSort(queryParams.sort.get());

  const filters: DataTableFilter[] = [
    {
      key: 'provider',
      label: 'Provider',
      type: 'select',
      operator: 'contains',
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
          <UserAvatar user={user} className="me-3" />
          <span className="fw-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </td>
      <td>{user.email}</td>
      <td>{user.provider}</td>
      <td>{formatDate(user.lastLoginAt)}</td>
      <td>
        <Link to={APP_ROUTES.USER_EDIT.replace(':userId', user.userId)}>
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
    <Button variant="primary" onClick={() => navigate(APP_ROUTES.USER_ADD)}>
      <Plus className="me-2" />
      Add New User
    </Button>
  );

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
        filterValues={queryParams.filters.get() || {}}
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