import { useState, useEffect } from 'react';
import { useLocation, matchPath } from 'react-router'; // this is correct

import NavigationContext from './NavigationContext';

const NavigationContextProvider = ({ children }) => {
  
  const [lastVisitedPagePerSection, setLastVisitedPagePerSection] = useState({});
  const location = useLocation();

  // Track last page visited each time path changes
  useEffect(() => {
    const sectionsToTrack = {
      presupuesto: '/presupuesto',
      pedido: '/pedido',
    };
    // Find which section the current path belongs to
    const currentSection = Object.keys(sectionsToTrack).find(section => 
      matchPath({ path: sectionsToTrack[section], end: false }, location.pathname)
    );
    // Only update if we're in a tracked section, on a subpage, and it has changed
    if (currentSection) {
      const isSubPath = location.pathname.startsWith(`/${currentSection}/`);
      const pathChanged = lastVisitedPagePerSection[currentSection] !== location.pathname;
      if (isSubPath && pathChanged) {
        setLastVisitedPagePerSection(prevPaths => ({
          ...prevPaths,
          [currentSection]: location.pathname,
        }));
      }
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  // Remove the last visited page for a section
  const resetlastVisitedPageOfSection = (section) => {
    setLastVisitedPagePerSection(prevPaths => {
      const newPaths = { ...prevPaths };
      delete newPaths[section];
      return newPaths;
    });
  };

  const contextValue = {
    lastVisitedPagePerSection,
    resetlastVisitedPageOfSection,
  };

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContextProvider;