import { Outlet, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";

function App() {
  return (
    <div>
      <AppBar position="static" sx={{ marginBottom: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pokémon Compare
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Strona główna
          </Button>
          <Button color="inherit" component={Link} to="/compare">
            Porównanie
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </div>
  );
}

export default App;
