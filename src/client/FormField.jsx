/** A wrapper that provides a label and structure for form inputs.
 *
 * @param {string} props.label - Label text
 * @param {string} props.htmlFor - ID of the input element this label is associated with
 * @param {React.ReactNode} props.children - Input component to render
 * @param {string} [props.className] - Optional additional CSS
 */
export default function FormField({ label, htmlFor, children, className = '' }) {

  const labelClasses = "block text-sm font-medium mb-1 text-black";

  return (
    <div className={`mb-4 ${className}`}>
      <label htmlFor={htmlFor} className={labelClasses}>
        {label}
      </label>
      {children}
    </div>
  );
}