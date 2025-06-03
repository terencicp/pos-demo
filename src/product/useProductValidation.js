import { useState, useEffect } from 'react';

/** Custom hook for product variation validation shared between order/returns and budget
 * 
 * @param {Array} products - Array of products to validate
 */
export default function useProductValidation(products) {

  const [validationTriggered, setValidationTriggered] = useState(false);
  const [validationState, setValidationState] = useState({
    variationErrors: {},
    isValid: true
  });

  function validateProducts(shouldShowErrors) {
    // Check for unselected variations in products
    const variationErrors = products.reduce((result, product) => {
      if (!product.variations) {
        return result;
      }
      const missingProductVariations = Object.keys(product.variations).filter(
        variationName => !product.selectedVariations?.[variationName]
      );
      if (missingProductVariations.length > 0) {
        result[product.key] = missingProductVariations.reduce((obj, name) => {
          obj[name] = true;
          return obj;
        }, {});
      }
      return result;
    }, {});
    // Check if no errors
    const isValid = Object.keys(variationErrors).length === 0;
    return {
      variationErrors: shouldShowErrors ? variationErrors : {},
      isValid
    };
  };

  // Perform validation whenever products (and variations) change
  useEffect(() => {
    setValidationState(validateProducts(validationTriggered));
    // eslint-disable-next-line
  }, [products, validationTriggered]);

  // Function to trigger when the next page button is clicked
  function validate() {
    setValidationTriggered(true);
    const result = validateProducts(true);
    setValidationState(result);
    return result.isValid;
  };

  return {
    ...validationState,
    validate
  };
}