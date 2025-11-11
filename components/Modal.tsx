import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-opacity"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-gray-800 rounded-lg shadow-xl w-11/12 max-w-4xl h-5/6 relative flex flex-col"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center z-10 text-xl"
          aria-label="Close dialog"
        >
          &times;
        </button>
        <div className="flex-1 overflow-hidden rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
