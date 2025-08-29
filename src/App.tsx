import { Outlet, Link } from "react-router-dom";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ marginRight: "10px" }}>Strona główna</Link>
        <Link to="/compare">Porównanie</Link>
      </nav>
      <Outlet />
    </div>
  );
}

export default App;
