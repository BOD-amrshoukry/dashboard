import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  usePortal?: boolean; // 👈 allow portal rendering
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  usePortal = true,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-reverse-background/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true">
      <div
        className="bg-second-background rounded-xl shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          className={clsx(
            'absolute top-3 text-gray-500 hover:text-gray-800',
            isRTL ? 'left-3' : 'right-3',
          )}
          onClick={onClose}
          aria-label="Close modal">
          ✕
        </button>

        {children}
      </div>
    </div>
  );

  return usePortal
    ? ReactDOM.createPortal(modalContent, document.body)
    : modalContent;
};

export default Modal;

