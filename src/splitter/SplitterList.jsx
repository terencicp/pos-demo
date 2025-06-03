import SplitterItem from './SplitterItem';
import EmptyListPlaceholder from './EmptyListPlaceholder';

/**
 * Renders a list section within the Splitter component.
 *
 * @param {string} props.title - The title of the list section.
 * @param {Array<object>} props.products - The products to display in the list.
 * @param {boolean} props.isInTopList - Indicates if this list is the top list.
 * @param {object} props.emptyListProps - Props for the EmptyList component.
 * @param {object} props.splitterItemProps - Common props for the SplitterItem component.
 */
export default function SplitterList({
  title,
  products,
  isInTopList,
  emptyListProps,
  splitterItemProps,
}) {
  
  const isEmpty = products.length === 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {isEmpty ? (
        <EmptyListPlaceholder {...emptyListProps} isInTopList={isInTopList} />
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <SplitterItem
              key={product.key}
              product={product}
              isInTopList={isInTopList}
              {...splitterItemProps}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
