import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>Team Task Manager</h2>

      <div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/projects">Projects</Link>
        <span>{user?.name} ({user?.role})</span>
        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}

export default Navbar;