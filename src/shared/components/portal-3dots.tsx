import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

export default function RowActionsMenuPortal<T>({
  row,
  actions,
  selectedKeys,
  t,
}: {
  row: T;
  actions: {
    label: string;
    icon: React.ReactNode;
    onClick: (row: T) => void;
    disabled?: (row: T, selectedKeys: Set<string | number>) => boolean;
  }[];
  selectedKeys: Set<string | number>;
  t: any;
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (buttonRef.current && !buttonRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleMenu() {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setOpen((s) => !s);
  }

  return (
    <>
      <button
        ref={buttonRef}
        className="p-1 hover:bg-gray-100 rounded"
        onClick={toggleMenu}>
        ⋮
      </button>

      {open &&
        createPortal(
          <div
            className="absolute bg-white border rounded shadow z-50 flex flex-col min-w-[140px]"
            style={{ top: pos.top, left: pos.left }}>
            {selectedKeys.size > 1 &&
            actions.some((a) => a.disabled?.(row, selectedKeys)) ? (
              <span className="text-gray-400 text-xs p-2">
                {t('tables.text.multipleSelection')}
              </span>
            ) : (
              actions.map((action, i) => (
                <button
                  key={i}
                  className={clsx(
                    'flex items-center gap-1 text-sm p-2 hover:bg-gray-100',
                    action.disabled?.(row, selectedKeys) &&
                      'opacity-50 cursor-not-allowed',
                  )}
                  disabled={action.disabled?.(row, selectedKeys)}
                  onClick={() => {
                    action.onClick(row);
                    setOpen(false);
                  }}
                  title={action.label}>
                  {action.icon} {action.label}
                </button>
              ))
            )}
          </div>,
          document.body,
        )}
    </>
  );
}

