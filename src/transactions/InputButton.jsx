/**
 * Reusable button group component designed to be placed inside input fields.
 * It renders a primary button and an optional secondary button.
 * Parent must be of class "relative" to position the buttons correctly.
 *
 * @param {function} props.onClick - Click handler for the primary button.
 * @param {string} props.text - Text for the primary button.
 * @param {boolean} [props.double=false] - If true, renders the secondary button.
 * @param {function} props.onSecondaryClick - Click handler for the secondary button.
 * @param {string} props.secondaryText - Text for the secondary button.
 * @param {'blue' | 'gray'} [props.color='blue'] - Button color
 */
export default function InputButton({
  onClick,
  text,
  isDouble = false,
  onSecondaryClick,
  secondaryText,
  color = 'blue',
}) {
  const baseButtonStyles = "px-2 py-1 text-[0.7rem] font-semibold rounded cursor-pointer transition";
  const blueButtonStyles = "text-white bg-blue-800 hover:bg-blue-600";
  const grayButtonStyles = "text-white bg-gray-600 hover:bg-gray-800";

  const currentButtonThemeStyles = color === 'gray' ? grayButtonStyles : blueButtonStyles;

  return (
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
      {isDouble && (
        <button onClick={onSecondaryClick} className={`${baseButtonStyles} ${currentButtonThemeStyles}`} tabIndex="-1" type="button">
          {secondaryText}
        </button>
      )}
      <button onClick={onClick} className={`${baseButtonStyles} ${currentButtonThemeStyles}`} tabIndex="-1" type="button">
        {text}
      </button>
    </div>
  );
}
