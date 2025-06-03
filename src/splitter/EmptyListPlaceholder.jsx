import { ArrowUp, ArrowDown } from 'lucide-react';

/**
 * Placeholder displayed when a list in the Splitter is empty
 *
 * @param {function} props.onMoveAll - Callback to move all items to this list
 * @param {boolean} props.isInTopList - Indicates if this placeholder is for the top list
 */
export default function EmptyListPlaceholder({ onMoveAll, isInTopList }) {
  const emptyListStyle = "text-sm text-gray-500 text-center border-2 border-dashed border-gray-300 " +
                         "rounded-md flex items-center justify-center h-[70px]";
  const moveAllArrowStyle = "text-gray-400 hover:text-blue-600 p-2 h-12 w-12";
  // Determine icon based on isInTopList
  const Icon = isInTopList ? ArrowUp : ArrowDown;

  return (
    <div className={emptyListStyle}>
        <button
          onClick={onMoveAll}
          className={moveAllArrowStyle}
        >
          <Icon className="h-full w-full" strokeWidth={2} />
        </button>
    </div>
  );
}
