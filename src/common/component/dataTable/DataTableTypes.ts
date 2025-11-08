export interface DataTableColumn {
  key: string;
  title: string;
  sortable?: boolean;
  width?: string;
}

export interface DataTableFilter {
  key: string;
  label: string;
  type: "select" | "text" | "date";
  options?: { value: string | number; label: string }[];
  placeholder?: string;
}

export interface DataTablePagination {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}

export interface DataTableQueryParams {
  page: number;
  pageSize: number;
  search: string;
  sort?: string;
  filters?: Record<string, string | number | boolean>;
}

export interface DataTableProps<T> {
  // Data
  items: T[];
  pagination?: DataTablePagination;
  isLoading: boolean;

  // Configuration
  columns: DataTableColumn[];
  filters?: DataTableFilter[];
  filterValues?: Record<string, string | number | boolean>;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];

  // Callbacks
  onSearch?: (search: string) => void;
  onFilter?: (key: string, value: string | number | boolean | null) => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onSort?: (sort?: string) => void;

  // Render functions
  renderRow: (item: T, index: number) => React.ReactNode;

  // Optional customization
  title?: string;
  actions?: React.ReactNode;
}
