import MenuItem from './MenuItem';

export default function Menu({ width }) {
  return (
    <>
      <div className={`${width} bg-gray-50 fixed top-0 bottom-0 left-0`}>
          {/* Menu background */}
      </div>
      <aside className={`${width} p-4 pt-6 relative z-10 bg-transparent`}>
        <h1 className="text-2xl font-bold my-1 ml-4 mb-4 text-blue-800">
          VENTAS
        </h1>
        <nav className="flex-grow">
          <ul>
            <MenuItem to="/pedido">Pedido</MenuItem>
            <MenuItem to="/presupuesto">Presupuesto</MenuItem>
            <MenuItem to="/documentos">Documentos</MenuItem>
          </ul>
        </nav>
      </aside>
    </>
  );
}
