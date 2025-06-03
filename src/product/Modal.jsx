import { useEffect } from 'react';

/**
 * @param {boolean} props.isOpen - Whether the modal is currently visible
 * @param {function} props.onClose - Function to call when the modal should close
 * @param {React.ReactNode} props.children - Content to display in the modal
 */
const Modal = ({ isOpen, onClose, children }) => {

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-y-0 right-0 left-[192px] z-50 flex items-center justify-center"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
    >
      <div className="bg-white rounded-md max-w-lg w-full mx-4">
        {children}
      </div>
    </div>
  );
};

export default Modal;