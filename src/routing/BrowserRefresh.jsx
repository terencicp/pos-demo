import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router"; // this is correct

import NavigationContextProvider from "./NavigationContextProvider.jsx";
import { getDefaultPageForPath } from "./defaultPages.js";
import Layout from "../layout/Layout.jsx";

export default function BrowserRefresh() {
  
  const navigate = useNavigate();
  const location = useLocation();

  // If browser refresh button clicked
  useEffect(() => {
    const browserRefresh = performance.getEntriesByType('navigation')[0]?.type === 'reload';
    if (browserRefresh) {
      // Navigate to the default page for the current section
      const defaultPage = getDefaultPageForPath(location.pathname);
      if (defaultPage) {
        navigate(defaultPage, { replace: true });
      }
    }
    // eslint-disable-next-line
  }, []);

  return (
    <NavigationContextProvider>
      <Layout />
    </NavigationContextProvider>
  );
}