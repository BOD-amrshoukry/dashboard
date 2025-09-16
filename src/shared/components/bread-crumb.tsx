import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

type DisplayedItem = BreadcrumbItem | '...';

// Simple hook to detect media queries
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query, matches]);

  return matches;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const [showHidden, setShowHidden] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isSmall = useMediaQuery('(max-width: 768px)'); // <768px
  const isMedium = useMediaQuery('(max-width: 992px)'); // <992px

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowHidden(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!items || items.length === 0) return null;

  // Decide how many items to show
  let sliceCount = 3; // default for large screens
  if (isSmall) sliceCount = 1;
  else if (isMedium) sliceCount = 2;

  const hiddenItems =
    items.length > sliceCount ? items.slice(0, items.length - sliceCount) : [];

  const displayedItems: DisplayedItem[] =
    items.length > sliceCount ? ['...', ...items.slice(-sliceCount)] : items;

  return (
    <nav className="relative flex items-center space-x-2 text-gray-600">
      {displayedItems.map((item, idx) => {
        const isLast = idx === displayedItems.length - 1;

        if (item === '...') {
          return (
            <div key={idx} className="relative" ref={dropdownRef}>
              <div className="space-x-2">
                <button
                  onClick={() => setShowHidden(!showHidden)}
                  className="text-main-text hover:text-main-text-hover cursor-pointer ">
                  ...
                </button>
                <span className="text-main">/</span>
              </div>

              {showHidden && hiddenItems.length > 0 && (
                <div className="absolute left-0 mt-2 w-[164px] max-h-[320px] overflow-auto bg-second-background rounded-lg shadow-lg z-50">
                  <ul className="py-2">
                    {hiddenItems.map((hidden, hIdx) => (
                      <li key={hIdx}>
                        {hidden.href ? (
                          <Link
                            to={hidden.href}
                            className="block px-4 py-2 text-main-text hover:bg-main-background truncate max-w-[132px] sm:max-w-[180px]"
                            title={hidden.label}>
                            {hidden.label}
                          </Link>
                        ) : (
                          <span
                            className="block px-4 py-2 text-main-text truncate max-w-[132px] sm:max-w-[180px]"
                            title={hidden.label}>
                            {hidden.label}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        }

        return (
          <div key={idx} className="flex items-center space-x-2">
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className={clsx(
                  'truncate max-w-[132px] sm:max-w-[180px] text-main-text hover:underline',
                )}
                title={item.label}>
                {item.label}
              </Link>
            ) : (
              <span
                className="truncate max-w-[132px] sm:max-w-[180px] text-main font-medium"
                title={item.label}>
                {item.label}
              </span>
            )}
            {!isLast && <span className="text-main">/</span>}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;

