import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Input from './input';
import Button from './button';
import { useTranslation } from 'react-i18next';
import type { FieldErrors } from 'react-hook-form';
import Loading from './loading';
import Refetch from './refetch';

interface PaginatedDatalistProps {
  queryKey: string;
  fetchFunction: (params: {
    pageIndex: number;
    pageSize: number;
    sortBy?: any;
    filters?: { id: string; value: string }[];
  }) => Promise<any>;
  itemKey: string;
  idKey?: string;
  label?: string;
  name: string;
  errors?: FieldErrors;
  onSelect?: (item: any) => void;
  placeholder?: string;
  value?: { [key: string]: any } | { [key: string]: any }[] | null;
  onChange?: (value: any) => void;
  multiple?: boolean;
  disabled?: boolean; // ✅ Add this to interface
}

export default function PaginatedDatalist({
  queryKey,
  fetchFunction,
  itemKey,
  idKey = 'id',
  label,
  name,
  errors,
  onSelect,
  placeholder,
  onChange,
  value = null,
  multiple = false,
  disabled = false,
}: PaginatedDatalistProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [manualSelection, setManualSelection] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pageSize = 10;

  // ✅ Initialize selected value(s)
  useEffect(() => {
    if (multiple) {
      setSelectedItems(Array.isArray(value) ? value : []);
    } else {
      setSelectedItems(value ? [value as any] : []);
      setQuery(value ? (value as any)[itemKey] ?? '' : '');
    }
  }, [value, itemKey, multiple]);

  // 🔹 Debounce input value
  useEffect(() => {
    if (manualSelection) return;
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query, manualSelection]);

  const {
    data,
    isPending: isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [queryKey, debouncedQuery, page],
    queryFn: () =>
      fetchFunction({
        pageIndex: page - 1,
        pageSize,
        sortBy: null,
        filters: debouncedQuery ? [{ id: itemKey, value: debouncedQuery }] : [],
      }),
    enabled: debouncedQuery.length > 0,
    placeholderData: keepPreviousData,
  });

  console.log('DATT', data);

  // Update dropdown position
  useLayoutEffect(() => {
    if (showDropdown && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setPosition({
        top: rect.top + rect.height + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [showDropdown, query, page]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: any) => {
    setManualSelection(true);

    if (multiple) {
      if (!selectedItems.find((i) => i[idKey] === item[idKey])) {
        const newItems = [...selectedItems, item];
        setSelectedItems(newItems);
        onChange?.(newItems.map((i) => i[idKey]));
      }
    } else {
      setSelectedItems([item]);
      setQuery(item[itemKey] ?? '');
      onChange?.(item[idKey]);
    }

    setShowDropdown(false);
    onSelect?.(item);
  };

  const removeItem = (id: any) => {
    const newItems = selectedItems.filter((i) => i[idKey] !== id);
    setSelectedItems(newItems);

    if (multiple) {
      onChange?.(newItems.map((i) => i[idKey]));
    } else {
      setQuery('');
      onChange?.(null);
    }
  };

  const dropdown = (() => {
    if (isLoading) {
      return (
        <div
          ref={dropdownRef}
          className="rounded-level1 bg-second-background border border-main overflow-hidden h-48 flex justify-center items-center"
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
          }}>
          <Loading />
        </div>
      );
    }

    if (showDropdown || isFetching) {
      return (
        <div
          ref={dropdownRef}
          className="rounded-level1 bg-second-background border border-main overflow-hidden"
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 9999,
          }}>
          {isFetching && !isLoading && (
            <div className="absolute inset-0 bg-main-background/30 flex items-center justify-center z-10">
              <Loading />
            </div>
          )}
          <>
            <ul className="shadow h-48 overflow-y-auto overflow-x-hidden w-full">
              {isError && (
                <div className="flex items-center gap-[16px]">
                  <p> {t('general.errors.load')}</p>
                  <Refetch refetch={refetch} />
                </div>
              )}
              {!isError &&
                data?.data?.length > 0 &&
                data?.data
                  ?.filter(
                    (item: any) =>
                      !selectedItems.some((s) => s[idKey] === item[idKey]),
                  )
                  .map((item: any) => (
                    <li
                      key={item[idKey]}
                      onClick={disabled ? () => {} : () => handleSelect(item)}
                      className="px-2 py-1 cursor-pointer hover:bg-main-background">
                      {item[itemKey]}
                    </li>
                  ))}
            </ul>
            <div className="flex gap-2 items-center justify-center bg-second-background p-[8px] shadow-2xl border-t-main border-t-1">
              <Button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="min-w-fit px-[16px]">
                {t('general.text.prev')}
              </Button>
              <span className="text-[14px]">
                {t('general.text.page')} {data?.meta?.pagination?.page ?? 1}{' '}
                {t('general.text.of')} {data?.meta?.pagination?.pageCount ?? 1}
              </span>
              <Button
                disabled={page >= (data?.meta?.pagination?.pageCount ?? 1)}
                onClick={() => setPage((p) => p + 1)}
                className="min-w-fit px-[16px]">
                {t('general.text.next')}
              </Button>
            </div>
          </>
        </div>
      );
    }

    return null;
  })();

  return (
    <div className="relative flex flex-col gap-[8px]">
      {label && <label>{label}</label>}

      <div
        className={clsx(
          'outline-0 rounded-level1 text-[14px] w-full flex',
          errors?.[name] ? 'border-error' : 'border-main',
        )}>
        <Input
          ref={inputRef}
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setManualSelection(false);
            setQuery(e.target.value);
            setPage(1);
            setShowDropdown(e.target.value.length > 0);
          }}
          placeholder={placeholder || t('general.text.search')}
          onFocus={disabled ? () => {} : () => query && setShowDropdown(true)}
          outerClassName="min-w-full border-none"
          errors={errors}
          name={name}
        />
      </div>

      {multiple ? (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedItems.map((item) => (
            <div
              key={item[idKey]}
              className="flex items-center bg-second-background rounded px-3 py-1">
              <span>{item[itemKey]}</span>
              <button
                onClick={disabled ? () => {} : () => removeItem(item[idKey])}
                className="ml-2 text-red-500 font-bold hover:text-red-700"
                disabled={disabled}>
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        selectedItems[0] && (
          <div className="flex items-center justify-between bg-second-background rounded px-3 py-2 mt-2">
            <span>{selectedItems[0][itemKey]}</span>
            <button
              disabled={disabled}
              onClick={
                disabled ? () => {} : () => removeItem(selectedItems[0][idKey])
              }
              className="ml-2 text-red-500 font-bold hover:text-red-700">
              ×
            </button>
          </div>
        )
      )}

      {showDropdown && createPortal(dropdown, document.body)}
    </div>
  );
}

