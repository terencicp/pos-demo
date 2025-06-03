// Product units that can be returned (not already returned or in transit)
export default function getReturnableQuantity(p) { // TODO: Abstract to Product type ?
  return p.originalQuantity - (p.previousReturnedQuantity || 0) - (p.lockedQuantity || 0);
}