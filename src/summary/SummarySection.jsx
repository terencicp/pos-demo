import { Link } from 'react-router';
import { SummaryIcon } from './SummaryIcon';

/** Wrapper for a summary section
 *
 * @param {string} [props.title] - Section title
 * @param {React.ElementType} [props.icon] - Lucide icon
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.className] - Additional CSS
 * @param {string} [props.to] - URL to navigate to when clicked
 */
export function SummarySection({ title, icon: Icon, children, className, to }) {
  const content = (
    <div className={`bg-white border-2 border-gray-300 rounded-xl p-4 mb-4 px-5 ${className || ''}`}>
      {title && (
        <div className="flex items-center text-lg font-semibold text-gray-800 mb-2">
          {Icon && <SummaryIcon icon={Icon} />}
          <h2>{title}</h2>
        </div>
      )}
      {children}
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}