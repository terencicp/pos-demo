// Start page for each section
export const sectionDefaultPage = {
  presupuesto: '/presupuesto/productos',
  pedido: '/pedido/productos'
};

// Given the current path, returns the start page for the current section
// Use for sections tracked in NavigationContextProvider
export function getDefaultPageForPath(path) {
  if (path.startsWith('/presupuesto')) {
    return sectionDefaultPage.presupuesto;
  } else if (path.startsWith('/pedido')) {
    return sectionDefaultPage.pedido;
  } 
  return null;
}