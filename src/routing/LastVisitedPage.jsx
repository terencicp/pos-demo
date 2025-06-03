import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router'; // this is correct

import NavigationContext from './NavigationContext';

// Go to the current section's last visited page or to the default page
export default function LastVisitedPage({ section, defaultPath }) {

  const { lastVisitedPagePerSection } = useContext(NavigationContext);
  const location = useLocation();
  const currentPath = location.pathname;
  let targetPath = defaultPath;
  const lastVisitedPage = lastVisitedPagePerSection[section];

  if (lastVisitedPage) {
    targetPath = lastVisitedPage;
  }
  
  if (currentPath !== targetPath) {
    return <Navigate to={targetPath} replace />;
  }
  
  return null; // Already at the target path, nothing rendered
}
