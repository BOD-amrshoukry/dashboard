export type FilterType =
  | { kind: 'text' }
  | { kind: 'number' }
  | { kind: 'select'; options: { label: string; value: string | number }[] };

export type Column<T> = {
  id: string;
  header: string;
  accessor: (row: T) => React.ReactNode;
  accessorRaw?: (row: T) => any;
  sortable?: boolean;
  filter?: FilterType;
  visible?: boolean;
  hiddenOnMobile?: boolean;
  width?: string;
  fixedVisible?: boolean; // ← new
};

export type FetchParams = {
  pageIndex: number;
  pageSize: number;
  sortBy?: { id: string; desc: boolean } | null;
  filters?: { id: string; value: any }[];
};

export type FetchResult<T> = { data: T[]; total: number };

