import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  const { t, i18n } = useTranslation();
  const isRTL = i18n.dir() === 'rtl';

  return (
    <>
      {/* Overlay */}

      {/* Modal content */}
      <div
        className="fixed inset-0 flex items-center justify-center z-[100] p-4 bg-reverse-background/50"
        onClick={onClose}>
        <div
          className="bg-second-background rounded-xl shadow-lg max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button
            className={clsx(
              'absolute top-3  text-gray-500 hover:text-gray-800',
              isRTL ? 'left-3' : 'right-3',
            )}
            onClick={onClose}>
            ✕
          </button>

          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;

