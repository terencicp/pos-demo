import { NavLink } from 'react-router';

export default function MenuItem({ to, children: text, onClick }) {
  
  function menuItemCss({ isActive }) {
    const base = "block py-3 px-4 my-2 rounded ";
    const active = "bg-blue-800 text-white";
    const hover = "hover:bg-gray-200";
    return base + (isActive ? active : hover);
  }

  return (
    <li>
      <NavLink to={to} className={menuItemCss} onClick={onClick}>{text}</NavLink>
    </li>
  );
}