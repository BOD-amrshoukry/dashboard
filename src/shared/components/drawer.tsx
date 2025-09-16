import React from 'react';
import { useTranslation } from 'react-i18next';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children }) => {
  const { i18n } = useTranslation();

  const rtl = i18n.dir() === 'rtl';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-reverse-background/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 h-full w-80 bg-main-background shadow-lg z-50 transform transition-transform duration-300 ${
          rtl
            ? isOpen
              ? 'right-0 translate-x-0'
              : 'right-0 translate-x-full'
            : isOpen
            ? 'left-0 translate-x-0'
            : 'left-0 -translate-x-full'
        }`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 cursor-pointer ${
            rtl ? 'left-4' : 'right-4'
          } text-gray-500 hover:text-gray-800 text-lg font-bold`}>
          ✕
        </button>

        <div className="p-4">{children}</div>
      </div>
    </>
  );
};

export default Drawer;

