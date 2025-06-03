import getReturnableQuantity from './getReturnableQuantity';

/** Readjusts quantities for the 3 input fields to ensure consistency
 * 
 * @param {object} product - Product state before the current change
 * @param {object} inputQuantities - Quantities for the 3 inputs including the current change
 * @param {string} changeSource - 'return', 'in-store', 'pickup'
 */
export default function constrainReturnQuantities(product, inputQuantities, changeSource) {

  let { returnQuantity, inStoreQuantity, pickupQuantity } = inputQuantities;

  const returnableQuantity = getReturnableQuantity(product);
  const fulfilledNotReturnedQuantity = product.fulfilledNotReturnedQuantity;
  const unfulfilledQuantity = Math.max(0, returnableQuantity - fulfilledNotReturnedQuantity); // TODO: Abstract to Product type ?
  let physicalQuantity = pickupQuantity + inStoreQuantity;

  // Constraint 1: Physical returns can't exceed the amount the customer has
  if (physicalQuantity > fulfilledNotReturnedQuantity) {
    if (changeSource === 'pickup') { 
      inStoreQuantity = fulfilledNotReturnedQuantity - pickupQuantity;
    } else if (changeSource === 'in-store') { 
      pickupQuantity = fulfilledNotReturnedQuantity - inStoreQuantity;
    }
  }
  physicalQuantity = pickupQuantity + inStoreQuantity;

  // Constraint 2: Physical returns can't exceed the total returned quantity
  if (physicalQuantity > returnQuantity) {
    const surplus = physicalQuantity - returnQuantity;
    if (changeSource === 'pickup') {
      inStoreQuantity = inStoreQuantity - Math.min((pickupQuantity), surplus);
    } else if (changeSource === 'in-store') {
      pickupQuantity = pickupQuantity - Math.min((inStoreQuantity), surplus);
    }
  }
  pickupQuantity = Math.max(0, Math.min(pickupQuantity, returnQuantity));
  inStoreQuantity = Math.max(0, Math.min(inStoreQuantity, returnQuantity - pickupQuantity));

  // Constraint 3: Physical returns must be at least the returned quantity minus the unfulfilled quantit
  const minPhysicalQuantity = returnQuantity - unfulfilledQuantity;
  if (physicalQuantity < minPhysicalQuantity) {
    const deficit = minPhysicalQuantity - physicalQuantity;
    const customerRemainingQuantity = fulfilledNotReturnedQuantity - pickupQuantity - inStoreQuantity;
    const maxPhysicalIncrease = Math.min(deficit, customerRemainingQuantity);
    if (maxPhysicalIncrease > 0) {
      if (changeSource === 'pickup') {
        inStoreQuantity += maxPhysicalIncrease;
      } else {
        pickupQuantity += maxPhysicalIncrease;
      }
    }
  }

  return { returnQuantity, inStoreQuantity, pickupQuantity };
}