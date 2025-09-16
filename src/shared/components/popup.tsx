import {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';

interface PortalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLElement>;
  children: ReactNode;
  offsetY?: number;
}

export default function PortalPopup({
  isOpen,
  onClose,
  anchorRef,
  children,
  offsetY = 8,
}: PortalPopupProps) {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // Update popup position relative to anchor
  useLayoutEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, anchorRef]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }

    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={popupRef}
      className="rounded-level1 bg-second-background border border-main shadow z-50 p-4 w-[280px]"
      style={{
        position: 'absolute',
        top: position.top + offsetY,
        left: !isRTL ? position.left : position.left - 280,
      }}>
      {children}
    </div>,
    document.body,
  );
}

