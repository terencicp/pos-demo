// Format prices to display
export function currencyEuro(integer) {
  const decimal = integer / 100;
  return decimal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
}

// Truncate number to 2 decimals and replace '.' with ',' (1900 -> "19,90")
export function currencyComma(number) {
  const decimal = Math.floor(number) / 100;
  const decimalString = decimal.toFixed(2).replace('.', ',');
  return decimalString.endsWith(',00') ? decimalString.slice(0, -3) : decimalString;
}

// Convert comma-separated numeric string to integer cents ("19,9" -> 1990)
export function currencyCommaToInt(string) {
  if (!string) return 0;
  const [integerPart, decimalPart = ''] = string.split(',');
  const twoDecimals = (decimalPart + '00').slice(0, 2)
  return parseInt(integerPart + twoDecimals);
}

// Check if number with optional comma and two cents ("9", "9,99")
export function isValidPrice(string) {
  return /^(?!00)\d*[,]?\d{0,2}$/.test(string)
}