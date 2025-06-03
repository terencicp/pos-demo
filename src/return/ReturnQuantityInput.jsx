import QuantityInput from '../splitter/QuantityInput';

export default function ReturnQuantityInput({ isVisible, value, max, onChange }) {
  if (!isVisible) return <div />;
  return (
    <div className="flex justify-center">
      <QuantityInput
        value={value}
        max={max}
        onChange={onChange}
      />
    </div>
  );
}