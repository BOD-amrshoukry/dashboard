/**
 * ReusableTable.tsx
 * Enhanced reusable React + TypeScript + Tailwind CSS table component.
 * Features:
 *  - Fixed headers with scrollable body
 *  - Sorting (asc/desc/none) per column
 *  - Filtering: choose one column to filter, debounced input
 *  - Popup for column visibility toggles
 *  - Pagination (client/server side)
 *  - Multi-row selection with select-all
 *  - Row actions (Edit, View, Delete); disabled when multiple rows selected
 *  - Bulk delete when multiple rows are selected
 */

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import PortalPopup from './popup';
import { ChevronDown, ChevronUp, Columns4 } from 'lucide-react';
import Button from './button';
import Checkbox from './checkbox';
import Select from './select';
import { useTranslation } from 'react-i18next';
import Input from './input';
import clsx from 'clsx';
import DataDisplay from './data-display';
import RowActionsMenuPortal from './portal-3dots';
import Loading from './loading';
import type { Column, FetchParams, FetchResult } from '../types/table';

// ---------------- Types ----------------

type Props<T> = {
  queryKey: string | string[];
  columns: Column<T>[];
  data?: T[];
  initialPageSize?: number;
  pageSizeOptions?: number[];
  serverSide?: boolean;
  fetchData?: (params: FetchParams) => Promise<FetchResult<T>>;
  className?: string;
  idForRow?: (row: T) => string | number;
  onEditRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
  onDeleteRow?: (row: T) => void;
  onBulkDelete?: (rows: T[]) => void;
  errorMessage?: string;
};

// ---------------- Helpers ----------------

function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

// ---------------- Table ----------------

export function ReusableTable<T extends object>({
  queryKey,
  columns: initialColumns,
  data: clientData = [],
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  serverSide = false,
  fetchData,
  className = '',
  idForRow,
  onEditRow,
  onViewRow,
  onDeleteRow,
  onBulkDelete,
  rowActions,
  bulkActions,
  is3Dots,
  errorMessage,
  loadingState,
}: Props<T>) {
  const [columns, setColumns] = useState(() =>
    initialColumns.map((c) => ({
      ...c,
      visible:
        c.visible !== false && !(c.hiddenOnMobile && window.innerWidth < 768),
    })),
  );

  useEffect(() => {
    let prevIsDesktop = window.innerWidth >= 768;

    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;

      // Only update if breakpoint changed
      if (isDesktop !== prevIsDesktop) {
        setColumns((cols) =>
          cols.map((c) =>
            c.hiddenOnMobile ? { ...c, visible: isDesktop } : c,
          ),
        );
        prevIsDesktop = isDesktop;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [sortBy, setSortBy] = useState<{ id: string; desc: boolean } | null>(
    null,
  );

  const [activeFilterCol, setActiveFilterCol] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const debouncedFilters = useDebouncedValue(filters, 350);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  // const [total, setTotal] = useState(0);
  // const [rows, setRows] = useState<T[]>([]);

  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
    new Set(),
  );
  const [showColumnPopup, setShowColumnPopup] = useState(false);
  const toggleButtonRef = useRef<HTMLButtonElement>(null);

  console.log('debouncedFilters', debouncedFilters);

  const { data, isPending, isError, isFetching, refetch } = useQuery({
    queryKey: Array.isArray(queryKey)
      ? [
          ...queryKey,
          pageIndex,
          pageSize,
          sortBy ? `${sortBy.id}-${sortBy.desc}` : null,
          JSON.stringify(debouncedFilters),
        ]
      : [
          queryKey,
          pageIndex,
          pageSize,
          sortBy ? `${sortBy.id}-${sortBy.desc}` : null,
          JSON.stringify(debouncedFilters),
        ],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const result = await fetchData?.({
        pageIndex,
        pageSize,
        sortBy,
        filters: Object.entries(debouncedFilters).map(([id, value]) => ({
          id,
          value,
        })),
      });
      return result ?? { data: [], total: 0 };
    },
  });
  const totalPages = Math.max(1, Math.ceil(data?.total / pageSize));

  useEffect(() => {
    setSelectedKeys(new Set());
  }, [data?.data]);

  function toggleSort(colId: string) {
    setPageIndex(0);
    setSortBy((prev) => {
      if (!prev || prev.id !== colId) return { id: colId, desc: false };
      if (prev.desc === false) return { id: colId, desc: true };
      return null;
    });
  }

  function setFilter(id: string, value: any) {
    setPageIndex(0);
    setFilters((s) => ({ ...s, [id]: value }));
  }

  function toggleColumnVisibility(id: string) {
    setColumns((cols) =>
      cols.map((c) =>
        c.id === id && !c.fixedVisible ? { ...c, visible: !c.visible } : c,
      ),
    );
  }

  const visibleColumns = columns.filter((c) => c.visible);

  function toggleRowSelection(key: string | number) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function toggleSelectAllCurrentPage() {
    const pageKeys = data?.data?.map((r) =>
      idForRow ? idForRow(r) : (r as any).id ?? (r as any).key,
    );
    const allSelected = pageKeys.every((k) => selectedKeys.has(k));
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        pageKeys.forEach((k) => next.delete(k));
      } else {
        pageKeys.forEach((k) => next.add(k));
      }
      return next;
    });
  }

  const allSelectedOnPage =
    data?.data.length > 0 &&
    data?.data.every((r) =>
      selectedKeys.has(
        idForRow ? idForRow(r) : (r as any).id ?? (r as any).key,
      ),
    );

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setShowColumnPopup(false);
      }
    }

    if (showColumnPopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showColumnPopup]);

  const { t } = useTranslation();

  console.log('activeFilterCol', activeFilterCol);

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative">
          <Button
            ref={toggleButtonRef}
            className="min-w-fit"
            onClick={() => setShowColumnPopup((s) => !s)}>
            <Columns4 />
          </Button>
          {showColumnPopup && (
            <PortalPopup
              anchorRef={toggleButtonRef}
              isOpen={showColumnPopup}
              onClose={() => setShowColumnPopup(false)}
              className="absolute mt-1 bg-white border rounded shadow z-20"
              ref={popupRef}>
              <div className="flex flex-col gap-[16px]">
                {columns.map((col) => (
                  <label
                    key={col.id}
                    className="flex items-center gap-1 text-sm text-main-text">
                    <Checkbox
                      checked={!!col.visible}
                      disabled={col.fixedVisible}
                      onChange={() => toggleColumnVisibility(col.id)}
                      label={col.header} // optional: label next to the checkbox
                    />
                  </label>
                ))}
              </div>
            </PortalPopup>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select
            value={activeFilterCol ?? ''}
            onChange={(val) => {
              setActiveFilterCol(val || null);
              setFilters({});
            }}
            placeholder={t('tables.text.filterKeyPlaceholder')}
            options={columns
              .filter((c) => c.filter)
              .map((col) => ({ label: col.header, value: col.id }))}
          />
          {activeFilterCol && (
            <div>
              {(() => {
                const col = columns.find((c) => c.id === activeFilterCol.value);
                if (!col?.filter) return null;
                if (col.filter.kind === 'text') {
                  return (
                    <Input
                      placeholder={t('tables.text.filter')}
                      value={filters[col.id] ?? ''}
                      onChange={(e) => setFilter(col.id, e.target.value)}
                    />
                  );
                } else if (col.filter.kind === 'number') {
                  return (
                    <div className="flex gap-1">
                      <input
                        type="number"
                        placeholder="min"
                        className="w-20 border rounded px-2 py-1 text-sm"
                        value={filters[col.id]?.min ?? ''}
                        onChange={(e) =>
                          setFilter(col.id, {
                            ...(filters[col.id] || {}),
                            min: e.target.value,
                          })
                        }
                      />
                      <input
                        type="number"
                        placeholder="max"
                        className="w-20 border rounded px-2 py-1 text-sm"
                        value={filters[col.id]?.max ?? ''}
                        onChange={(e) =>
                          setFilter(col.id, {
                            ...(filters[col.id] || {}),
                            max: e.target.value,
                          })
                        }
                      />
                    </div>
                  );
                } else if (col.filter.kind === 'select') {
                  return (
                    <Select
                      value={filters[col.id] ?? ''}
                      onChange={(val) => {
                        setFilter(col.id, val || '');
                        console.log(filters);
                        console.log(val);
                      }}
                      placeholder={t('tables.text.filterValuePlaceholder')}
                      options={[
                        { label: t('general.text.all'), value: '' }, // "All" option
                        ...(col.filter?.options ?? []), // spread dynamic options if provided
                      ]}
                    />
                  );
                }
                return null;
              })()}
            </div>
          )}
        </div>
      </div>

      <DataDisplay
        isLoading={isPending}
        data={data}
        refetch={refetch}
        error={isError ? errorMessage : undefined}>
        {/* Table */}
        <div className="border border-main rounded-level1 overflow-hidden">
          <div className="overflow-auto h-[60vh] relative ">
            {!isPending && (
              <table className="table-fixed w-full min-w-[600px]">
                <thead>
                  <tr className="bg-main-text-helper text-second-background">
                    {bulkActions?.length > 0 && (
                      <th className="sticky top-0 z-30  p-2 text-center w-[56px] bg-main-text-helper">
                        <div className="flex items-center justify-center">
                          <th className="sticky top-0 z-30 p-2 text-center w-[56px] bg-main-text-helper">
                            <div className="flex items-center justify-center">
                              <Checkbox
                                variant="inverse"
                                checked={allSelectedOnPage}
                                onChange={toggleSelectAllCurrentPage}
                              />
                            </div>
                          </th>
                        </div>
                      </th>
                    )}
                    {visibleColumns.map((col) => (
                      <th
                        key={col.id}
                        className={`sticky top-0 z-10  p-[12px] align-middle max-w-[200px] truncate whitespace-nowrap overflow-hidden  bg-main-text-helper w-full `}
                        style={{ width: col.width }}
                        onClick={() => col.sortable && toggleSort(col.id)}>
                        <div className="flex items-center gap-2">
                          <span className="cursor-pointer select-none">
                            {col.header}
                          </span>
                          {col.sortable && (
                            <span className="text-xs text-text-secondary">
                              {sortBy ? (
                                sortBy.id === col.id ? (
                                  sortBy.desc ? (
                                    <ChevronDown />
                                  ) : (
                                    <ChevronUp />
                                  )
                                ) : (
                                  ''
                                )
                              ) : (
                                ''
                              )}
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                    {rowActions && rowActions.length > 0 && (
                      <th className="sticky top-0 z-10 p-2 text-start bg-main-text-helper w-[124px]">
                        {t('tables.text.actions')}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {false ? (
                    <tr>
                      <td
                        colSpan={visibleColumns.length + 2}
                        className="p-4 text-center">
                        <Loading />
                      </td>
                    </tr>
                  ) : data?.data?.length === 0 ? (
                    <tr>
                      <td
                        colSpan={visibleColumns.length + 2}
                        className="p-4 text-center">
                        {t('general.text.noResults')}
                      </td>
                    </tr>
                  ) : (
                    data?.data?.map((row, rowIndex) => {
                      const key = idForRow
                        ? idForRow(row)
                        : (row as any).id ?? rowIndex;

                      const selected = selectedKeys.has(key);
                      return (
                        <tr
                          key={String(key)}
                          className={clsx(
                            rowIndex % 2 === 0
                              ? 'bg-second-background'
                              : 'bg-main-background',
                          )}>
                          {bulkActions?.length > 0 && (
                            <td className="p-2">
                              <div className="flex items-center justify-center">
                                <Checkbox
                                  checked={selected}
                                  onChange={() => toggleRowSelection(key)}
                                />
                              </div>
                            </td>
                          )}
                          {visibleColumns.map((col) => {
                            console.log(row);
                            return (
                              <td
                                key={col.id}
                                className="p-[12px] align-middle max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                                {col.accessor(row)}
                              </td>
                            );
                          })}
                          <td className="">
                            {(selectedKeys.size >= 1 &&
                              bulkActions &&
                              bulkActions.length > 0) ||
                            (rowActions && rowActions.length > 0) ? (
                              is3Dots ? (
                                <RowActionsMenuPortal
                                  actions={
                                    selectedKeys.size >= 1
                                      ? bulkActions!.map((action) => ({
                                          ...action,
                                          onClick: () =>
                                            action.onClick(
                                              data!.data.filter((r) =>
                                                selectedKeys.has(
                                                  idForRow
                                                    ? idForRow(r)
                                                    : (r as any).id ??
                                                        (r as any).key,
                                                ),
                                              ),
                                            ),
                                        }))
                                      : rowActions
                                  }
                                  row={row}
                                  selectedKeys={selectedKeys}
                                  t={t}
                                />
                              ) : selectedKeys.size >= 1 &&
                                bulkActions &&
                                bulkActions.length > 0 ? (
                                // Bulk actions (inline)
                                <div className="flex gap-2 text-sm flex-wrap">
                                  {bulkActions.map((action, i) => (
                                    <button
                                      key={i}
                                      className={clsx(
                                        'px-2 py-1 text-sm flex items-center gap-1 rounded text-main',
                                        action.color === 'red' &&
                                          'text-red-600',
                                        action.color === 'green' &&
                                          'text-green-600',
                                        action.color === 'blue' &&
                                          'text-blue-600',
                                        '',
                                      )}
                                      onClick={() =>
                                        action.onClick(
                                          data!.data.filter((r) =>
                                            selectedKeys.has(
                                              idForRow
                                                ? idForRow(r)
                                                : (r as any).id ??
                                                    (r as any).key,
                                            ),
                                          ),
                                        )
                                      }>
                                      {action.icon}
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                // Single row actions (inline)
                                <div className="flex gap-2 text-sm">
                                  {selectedKeys.size > 1 &&
                                  rowActions.some((a) =>
                                    a.disabled?.(row, selectedKeys),
                                  ) ? (
                                    <span className="text-gray-400 text-xs">
                                      {t('tables.text.multipleSelection')}
                                    </span>
                                  ) : (
                                    rowActions.map((action, i) => (
                                      <button
                                        key={i}
                                        className={clsx(
                                          'text-main',
                                          action.disabled?.(
                                            row,
                                            selectedKeys,
                                          ) && 'opacity-50 cursor-not-allowed',
                                        )}
                                        disabled={action.disabled?.(
                                          row,
                                          selectedKeys,
                                        )}
                                        onClick={() => action.onClick(row)}
                                        title={action.label}>
                                        {action.icon}
                                      </button>
                                    ))
                                  )}
                                </div>
                              )
                            ) : null}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            )}
            {(isFetching || loadingState) && (
              <div className="absolute inset-0 bg-main-background/30 flex items-center justify-center z-10">
                <Loading />
              </div>
            )}
          </div>

          {/* Pagination */}
          {!isPending && (
            <div className="flex items-center justify-between  border-t border-t-main flex-wrap gap-[16px] p-[12px]">
              <div className="text-sm">
                {t('general.text.selected')}: {selectedKeys.size}{' '}
                {t('general.text.of')} {data?.total} {t('tables.text.items')}
              </div>

              <div>
                <div className="flex items-center gap-[16px] flex-wrap">
                  <div className="flex items-center gap-[4px] flex-wrap">
                    <div className="text-sm">
                      {t('tables.text.rowsPerPage')}:{' '}
                    </div>
                    <Select
                      value={{ label: pageSize, value: pageSize }}
                      onChange={(val) => {
                        setPageSize(Number(val.value));
                        setPageIndex(0);
                      }}
                      options={pageSizeOptions.map((s) => ({
                        label: s.toString(),
                        value: s.toString(),
                      }))}
                      outerClassName="w-[50px]"
                    />
                  </div>
                  <div className="text-sm">
                    {t('general.text.page')} {pageIndex + 1}{' '}
                    {t('general.text.of')} {totalPages}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      className="min-w-fit px-[24px]"
                      onClick={() => setPageIndex((p) => Math.max(0, p - 1))}
                      disabled={pageIndex === 0}>
                      {t('general.text.prev')}
                    </Button>
                    <Button
                      className="min-w-fit px-[24px]"
                      onClick={() =>
                        setPageIndex((p) => Math.min(totalPages - 1, p + 1))
                      }
                      disabled={pageIndex >= totalPages - 1}>
                      {t('general.text.next')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DataDisplay>
    </div>
  );
}

