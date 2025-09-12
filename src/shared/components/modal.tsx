import React from 'react';
import ReactDOM from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}

      {/* Modal content */}
      <div
        className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-reverse-background/50"
        onClick={onClose}>
        <div
          className="bg-second-background rounded-xl shadow-lg max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}>
          {/* Close button */}
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
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

