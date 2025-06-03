import { createBrowserRouter, RouterProvider } from "react-router"; // this is correct

import BrowserRefresh from "./BrowserRefresh.jsx";
import LastVisitedPage from "./LastVisitedPage.jsx";
import BudgetHeader from "../layout/BudgetHeader";
import OrderHeader from "../layout/OrderHeader";
import BudgetProductsPage from "../page/budget/BudgetProductsPage";
import BudgetClientPage from "../page/budget/BudgetClientPage";
import BudgetSummaryPage from "../page/budget/BudgetSummaryPage";
import OrderReturnPage from "../page/order/OrderReturnPage.jsx";
import OrderProductsPage from "../page/order/OrderProductsPage";
import OrderCollectedPage from "../page/order/OrderCollectedPage";
import OrderClientPage from "../page/order/OrderClientPage";
import OrderPaymentsPage from "../page/order/OrderPaymentsPage";
import OrderRefundsPage from "../page/order/OrderRefundsPage";
import OrderSummaryPage from "../page/order/OrderSummaryPage";
import DocumentsPage from "../page/documents/DocumentsPage";
import { sectionDefaultPage } from "./defaultPages.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BrowserRefresh />,
    children: [
      {
        index: true,
        element: <LastVisitedPage section="pedido" defaultPath={sectionDefaultPage.pedido} /> 
      },
      {
        path: "presupuesto",
        element: <BudgetHeader />,
        children: [
          {
            index: true,
            element: <LastVisitedPage section="presupuesto" defaultPath={sectionDefaultPage.presupuesto} /> 
          },
          { path: "productos", element: <BudgetProductsPage /> },
          { path: "cliente", element: <BudgetClientPage /> },
          { path: "resumen", element: <BudgetSummaryPage /> },
        ],
      },
      {
        path: "pedido",
        element: <OrderHeader />,
        children: [
          {
            index: true,
            element: <LastVisitedPage section="pedido" defaultPath={sectionDefaultPage.pedido} />
          },
          { path: "devolucion", element: <OrderReturnPage /> },
          { path: "productos", element: <OrderProductsPage /> },
          { path: "entrega", element: <OrderCollectedPage /> },
          { path: "cliente", element: <OrderClientPage /> },
          { path: "pagos", element: <OrderPaymentsPage /> },
          { path: "reembolsos", element: <OrderRefundsPage /> },
          { path: "resumen", element: <OrderSummaryPage /> },
        ],
      },
      {
        path: "documentos",
        element: <DocumentsPage />,
      },
    ],
  },
], {
  basename: "/pos-demo/",
});

export default function App() {
  return <RouterProvider router={router} />;
}
