import { Outlet } from "react-router"; // this is correct

import Menu from "./Menu.jsx";
import OrderContextProvider from "../context/OrderContextProvider.jsx";

export default function Layout() {


  const menuWidth = 'w-42';

  return (
    <div className="flex min-h-screen">
        <Menu width={menuWidth} />
        <main className="flex-1 px-6 pb-5 pt-16 md:pt-5 mt-2 overflow-auto max-w-5xl mx-auto">
          <OrderContextProvider>
            <Outlet />
          </OrderContextProvider>
        </main>
    </div>
  );
}