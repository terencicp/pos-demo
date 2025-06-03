import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Routes from './routing/Routes.jsx';
import './tailwind.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Routes />
  </StrictMode>,
)
