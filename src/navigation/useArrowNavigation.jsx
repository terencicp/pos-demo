import { useEffect } from 'react';

/**
 * Custom hook to enable navigation between pages using arrow keys.
 * It triggers click events on navigation buttons with the specified IDs.
 */
export default function useArrowNavigation() {
  useEffect(() => {
    function handleKeyDown(event) {
      // Ignore key presses if modifier keys are held or if the event originates from inputs
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
        return;
      }
      let buttonToClick = null;
      if (event.key === 'ArrowLeft') {
        buttonToClick = document.getElementById('navigate-back-button');
      } else if (event.key === 'ArrowRight') {
        buttonToClick = document.getElementById('navigate-forward-button');
      }
      if (buttonToClick) {
        event.preventDefault(); // Prevent default browser behavior (like scrolling)
        buttonToClick.click();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown); // Cleanup
    };
  }, []);
}
